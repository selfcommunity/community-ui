import React, {useEffect, useMemo, useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Fade,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Category from './Steps/Category';
import {PREFIX} from './constants';
import {
  getTheme,
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCThemeContextType,
  SCThemeType,
  SCUserContextType,
  usePreviousValue,
  UserUtils,
  useSCContext,
  useSCFetchCategories,
  useSCPreferences,
  useSCTheme,
  useSCUser
} from '@selfcommunity/react-core';
import Appearance from './Steps/Appearance';
import Profile from './Steps/Profile';
import Invite from './Steps/Invite';
import App from './Steps/App';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import Widget from '../Widget';
import Content from './Steps/Content';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Endpoints, http, HttpResponse, OnBoardingService, PreferenceService, StartStepParams} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  SCCategoryType,
  SCFeedObjectType,
  SCOnBoardingStepStatusType,
  SCOnBoardingStepType,
  SCStepType,
  SCOnBoardingStepIdType
} from '@selfcommunity/types';
import OnBoardingWidgetSkeleton from './Skeleton';
import {closeSnackbar, SnackbarKey, useSnackbar} from 'notistack';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import HeaderPlaceholder from '../../assets/onBoarding/header';
import BaseDialog from '../../shared/BaseDialog';
import PubSub from 'pubsub-js';
import {SCCategoryEventType, SCTopicType} from '../../constants/PubSub';
import OnBoardingActionsButton from './ActionsButton';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  accordionRoot: `${PREFIX}-accordion-root`,
  logo: `${PREFIX}-logo`,
  intro: `${PREFIX}-intro`,
  steps: `${PREFIX}-steps`,
  stepsMobile: `${PREFIX}-steps-mobile`,
  stepContent: `${PREFIX}-step-content`,
  dialogRoot: `${PREFIX}-dialog-root`,
  dialogContent: `${PREFIX}-dialog-content`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const AccordionRoot = styled(Accordion, {
  name: PREFIX,
  slot: 'AccordionRoot',
  overridesResolver: (props, styles) => styles.accordionRoot
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface OnBoardingWidgetProps extends VirtualScrollerItemProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The params to add to content step generation
   * @default {}
   */
  GenerateContentsParams?: StartStepParams;
  /**
   * The callback to pass to the feeds to publish the generated content
   * @param feedObj
   * @default null
   */
  onGeneratedContent?: (feedObjs: SCFeedObjectType[]) => void;
  /**
   * Force widget expanded
   * @default false
   */
  forceExpanded?: boolean;
  /**
   * The initial step to display
   */
  initialStep?: SCOnBoardingStepType;
}

const OnBoardingWidget = (inProps: OnBoardingWidgetProps) => {
  // PROPS
  const props: OnBoardingWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    GenerateContentsParams = {},
    onGeneratedContent = null,
    onHeightChange,
    onStateChange,
    forceExpanded = false,
    initialStep,
    ...rest
  } = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [steps, setSteps] = useState<SCStepType[]>([]);
  const nextStep = useMemo(() => {
    const step = steps?.find((step) => (initialStep ? step.step === initialStep : step.status === 'in_progress' || step.status === 'not_started'));
    return step || steps?.[0];
  }, [steps]);
  const allStepsDone = useMemo(() => {
    return steps?.every((step) => step.status === SCOnBoardingStepStatusType.COMPLETED);
  }, [steps]);
  const [expanded, setExpanded] = useState(!allStepsDone || forceExpanded);
  const [_step, setStep] = useState<SCStepType>(nextStep);
  const currentContentsStep = steps?.find((s) => s.step === SCOnBoardingStepType.CONTENTS);
  const prevContentsStep = usePreviousValue(currentContentsStep);
  const currentCategoriesStep = steps?.find((s) => s.step === SCOnBoardingStepType.CATEGORIES);
  const prevCategoriesStep = usePreviousValue(currentCategoriesStep);
  const [showNoCategoriesModal, setShowNoCategoriesModal] = useState<boolean>(false);
  const [showCategoriesWarningModal, setShowWarningCategoriesModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const isAdmin = useMemo(() => UserUtils.isCommunityCreator(scUserContext.user), [scUserContext.user]);
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const scThemeContext: SCThemeContextType = useSCTheme();
  const {enqueueSnackbar} = useSnackbar();
  const showOnBoarding = useMemo(
    () =>
      scPreferencesContext.preferences &&
      SCPreferences.CONFIGURATIONS_ONBOARDING_ENABLED in scPreferencesContext.preferences &&
      SCPreferences.CONFIGURATIONS_ONBOARDING_HIDDEN in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_ONBOARDING_ENABLED].value &&
      !scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_ONBOARDING_HIDDEN].value,
    [scPreferencesContext.preferences]
  );

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {categories, isLoading} = useSCFetchCategories();

  // HANDLERS
  /**
   * Notify changes to Feed if the Widget is contained
   */
  const notifyLayoutChanges = useMemo(
    () =>
      (state?: Record<string, any>): void => {
        if (onStateChange && state) {
          onStateChange(state);
        }
        onHeightChange && onHeightChange();
      },
    [onStateChange, onHeightChange]
  );

  const completeStep = async (s: SCStepType) => {
    if (s.status !== SCOnBoardingStepStatusType.COMPLETED) {
      await OnBoardingService.completeAStep(s.id)
        .then(() => {
          setSteps((prev) =>
            prev.map((item) => {
              if (item.id === s.id) {
                return {...item, status: SCOnBoardingStepStatusType.COMPLETED, completion_percentage: 100};
              }
              return item;
            })
          );
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
    s.step === SCOnBoardingStepType.APPEARANCE && handlePreferencesUpdate();
  };

  /**
   * Fetches platform url
   */
  function fetchPlatform(query: string) {
    http
      .request({
        url: Endpoints.Platform.url(),
        method: Endpoints.Platform.method,
        params: {
          next: query
        }
      })
      .then((res: HttpResponse<any>) => {
        const platformUrl = res.data.platform_url;
        window.open(platformUrl, '_blank').focus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const showSuccessAlert = (step: SCStepType) => {
    setIsGenerating(false);
    enqueueSnackbar(
      <FormattedMessage id={`ui.onBoardingWidget.step.${step.step}.success`} defaultMessage={`ui.onBoardingWidget.step.${step.step}.success`} />,
      {
        action: (snackbarId: SnackbarKey) => (
          <>
            {step.step === SCOnBoardingStepType.CATEGORIES && (
              <Button
                sx={{textTransform: 'uppercase', color: 'white'}}
                size="small"
                variant="text"
                onClick={() => fetchPlatform('/contents/interests/')}>
                <FormattedMessage
                  id="ui.onBoardingWidget.step.categories.success.link"
                  defaultMessage="ui.onBoardingWidget.step.categories.success.link"
                />
              </Button>
            )}
            <IconButton sx={{color: 'white'}} onClick={() => closeSnackbar(snackbarId)}>
              <Icon>close</Icon>
            </IconButton>
          </>
        ),
        variant: 'success',
        autoHideDuration: 7000
      }
    );
  };

  const getSteps = async () => {
    await OnBoardingService.getAllSteps()
      .then((res) => {
        const contentStep = res.results.find((step) => step.step === SCOnBoardingStepType.CONTENTS);
        setIsGenerating(res.results.some((step) => step.status === 'in_progress'));
        setSteps(res.results);
        setLoading(false);
        if (contentStep.status === SCOnBoardingStepStatusType.IN_PROGRESS && contentStep.results.length !== 0 && onGeneratedContent) {
          onGeneratedContent(contentStep.results as SCFeedObjectType[]);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setLoading(false);
      });
  };

  const handleChange = (newStep: SCStepType) => {
    setStep(newStep);
  };

  const handleExpand = () => {
    const _expanded = !expanded;
    setExpanded(_expanded);
    notifyLayoutChanges({forceExpanded: _expanded});
  };

  const generateContent = async (stepId: number) => {
    if (!isLoading && !categories.length) {
      setShowNoCategoriesModal(true);
    } else if (stepId === SCOnBoardingStepIdType.CATEGORIES) {
      setShowWarningCategoriesModal(true);
    } else {
      await startStep(stepId);
    }
  };

  const startStep = async (stepId: number) => {
    showCategoriesWarningModal && setShowWarningCategoriesModal(false);
		try {
			await OnBoardingService.startAStep(stepId, GenerateContentsParams);
			setIsGenerating(true);
		} catch (error) {
			Logger.error(SCOPE_SC_UI, error);
			enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
				variant: 'error',
				autoHideDuration: 3000
			});
		}
  };

  const handlePreferencesUpdate = () => {
    PreferenceService.getAllPreferences().then((preferences) => {
      const prefs = preferences['results'].reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
      scPreferencesContext.setPreferences(prefs);
      scThemeContext.setTheme(getTheme(scContext.settings.theme, prefs));
    });
  };

  const handleCategoriesClick = () => {
    fetchPlatform('/contents/interests/');
    setShowNoCategoriesModal(false);
  };

  /**
   * Notify when a category info changes
   * @param data
   */
  function notifyCategoryChanges(data: SCCategoryType) {
    data && PubSub.publish(`${SCTopicType.CATEGORY}.${SCCategoryEventType.EDIT}`, data);
  }

  // EFFECTS

  useEffect(() => {
    if (
      prevContentsStep &&
      (prevContentsStep as SCStepType).status === SCOnBoardingStepStatusType.IN_PROGRESS &&
      currentContentsStep?.status === SCOnBoardingStepStatusType.COMPLETED
    ) {
      showSuccessAlert(currentContentsStep);
    }
  }, [currentContentsStep, prevContentsStep]);

  useEffect(() => {
    if (
      prevCategoriesStep &&
      (prevCategoriesStep as SCStepType).status === SCOnBoardingStepStatusType.IN_PROGRESS &&
      currentCategoriesStep?.status === SCOnBoardingStepStatusType.COMPLETED
    ) {
      showSuccessAlert(currentCategoriesStep);
    }
  }, [currentCategoriesStep, prevCategoriesStep]);

  useEffect(() => {
    if (!initialized && nextStep) {
      setStep(nextStep);
      setInitialized(true);
      notifyLayoutChanges({forceExpanded: expanded});
    }
  }, [initialized, nextStep]);

  useEffect(() => {
    const _expanded = !allStepsDone;
    setExpanded(_expanded);
    notifyLayoutChanges({forceExpanded: _expanded});
  }, [allStepsDone]);

  useEffect(() => {
    if (isAdmin && showOnBoarding) {
      getSteps();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const intervalId = setInterval(getSteps, isGenerating ? 6000 : 3 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [scUserContext?.user, isGenerating, isAdmin, showOnBoarding]);

  /**
   * updates categories info when generating category content
   */
  useEffect(() => {
    const categoryStep = steps.find((step) => step.step === SCOnBoardingStepType.CATEGORIES);

    if (categoryStep?.status === SCOnBoardingStepStatusType.IN_PROGRESS && categoryStep.results.length !== 0) {
      categoryStep.results.forEach((c: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const isAlreadyNotified = prevCategoriesStep?.results.some((result: any) => result.id === c.id);
        if (!isAlreadyNotified) {
          notifyCategoryChanges(c);
        }
      });
    }
  }, [steps, prevCategoriesStep]);

  /**
   * Render _step content section
   */
  const getStepContent = () => {
    const stepObj = steps?.find((obj) => obj.step === _step?.step);
    let content;
    switch (stepObj?.step) {
      case SCOnBoardingStepType.CONTENTS:
        content = <Content step={stepObj} handleContentCreation={() => generateContent(stepObj.id)} />;
        break;
      case SCOnBoardingStepType.CATEGORIES:
        content = <Category step={stepObj} handleCategoriesCreation={() => generateContent(stepObj.id)} />;
        break;
      case SCOnBoardingStepType.APPEARANCE:
        content = <Appearance onCompleteAction={() => completeStep(stepObj)} />;
        break;
      case SCOnBoardingStepType.PROFILE:
        content = <Profile onCompleteAction={() => completeStep(stepObj)} />;
        break;
      case SCOnBoardingStepType.INVITE:
        content = <Invite onCompleteAction={() => completeStep(stepObj)} />;
        break;
      case SCOnBoardingStepType.APP:
        content = <App step={stepObj} onCompleteAction={() => completeStep(stepObj)} />;
        break;
      default:
        break;
    }
    return content;
  };

  if (!isAdmin || !showOnBoarding) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <AccordionRoot defaultExpanded className={classes.accordionRoot} expanded={expanded}>
        <AccordionSummary
          expandIcon={<OnBoardingActionsButton isExpanded={expanded} onExpandChange={handleExpand} onHideOnBoarding={handlePreferencesUpdate} />}
          aria-controls="accordion"
          id="onBoarding-accordion">
          <>
            {expanded ? (
              <>
                {!isMobile ? (
                  <CardMedia className={classes.logo} component="img" src={HeaderPlaceholder} />
                ) : (
                  <Typography variant="h4">
                    <Icon color="secondary" fontSize="medium">
                      ai_stars
                    </Icon>
                    <FormattedMessage
                      id="ui.onBoardingWidget.accordion.expanded.title.mobile"
                      defaultMessage="ui.onBoardingWidget.accordion.expanded.title.mobile"
                      values={{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        b: (chunks) => <strong>{chunks}</strong>
                      }}
                    />
                  </Typography>
                )}
                <Box className={classes.intro}>
                  {!isMobile && (
                    <Typography variant="h4">
                      <FormattedMessage
                        id="ui.onBoardingWidget.accordion.expanded.title"
                        defaultMessage="ui.onBoardingWidget.accordion.expanded.title"
                      />
                    </Typography>
                  )}
                  <Typography variant="h5">
                    <FormattedMessage
                      id="ui.onBoardingWidget.accordion.expanded.subtitle"
                      defaultMessage="ui.onBoardingWidget.accordion.expanded.subtitle"
                    />
                  </Typography>
                  <Typography>
                    <FormattedMessage
                      id="ui.onBoardingWidget.accordion.expanded.summary"
                      defaultMessage="ui.onBoardingWidget.accordion.expanded.summary"
                      values={{
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        b: (chunks) => <strong>{chunks}</strong>,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        icon: (...chunks) => <Icon>{chunks}</Icon>
                      }}
                    />
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body1">
                <FormattedMessage
                  id="ui.onBoardingWidget.accordion.collapsed"
                  defaultMessage="ui.onBoardingWidget.accordion.collapsed"
                  values={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    b: (chunks) => <strong>{chunks}</strong>,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    // eslint-disable-next-line prettier/prettier
                    icon: (...chunks) => <Icon color="secondary" fontSize="medium">{chunks}</Icon>
                  }}
                />
              </Typography>
            )}
          </>
        </AccordionSummary>
        <AccordionDetails>
          <Widget className={classes.content} elevation={0}>
            {loading ? (
              <OnBoardingWidgetSkeleton />
            ) : (
              <CardContent>
                <List className={isMobile ? classes.stepsMobile : classes.steps}>
                  {steps?.map((step: SCStepType) => (
                    <ListItem key={step.id}>
                      {isMobile ? (
                        <Chip
                          size="small"
                          label={
                            <>
                              <FormattedMessage id={`ui.onBoardingWidget.${step.step}`} defaultMessage={`ui.onBoardingWidget.${step.step}`} />{' '}
                              {step.status === SCOnBoardingStepStatusType.COMPLETED && (
                                <Icon
                                  color={step?.status === SCOnBoardingStepStatusType.COMPLETED && step?.step !== _step?.step ? 'success' : 'inherit'}>
                                  check
                                </Icon>
                              )}
                            </>
                          }
                          onClick={() => handleChange(step)}
                          variant={step.step === _step?.step ? 'filled' : 'outlined'}
                          color={step.status === SCOnBoardingStepStatusType.COMPLETED ? 'success' : 'default'}
                        />
                      ) : (
                        <ListItemButton onClick={() => handleChange(step)} selected={step?.step === _step?.step}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={step.status === SCOnBoardingStepStatusType.COMPLETED}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{'aria-labelledby': step.step}}
                              size={'small'}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={<FormattedMessage id={`ui.onBoardingWidget.${step.step}`} defaultMessage={`ui.onBoardingWidget.${step.step}`} />}
                          />
                        </ListItemButton>
                      )}
                    </ListItem>
                  ))}
                </List>
                <Box className={classes.stepContent}>
                  <Fade in timeout={2400}>
                    <Box>{getStepContent()}</Box>
                  </Fade>
                  {showNoCategoriesModal && (
                    <BaseDialog
                      title={<FormattedMessage id="ui.onBoardingWidget.ai.no.categories" defaultMessage="ui.onBoardingWidget.ai.no.categories" />}
                      DialogContentProps={{dividers: false}}
                      open={showNoCategoriesModal}
                      onClose={() => setShowNoCategoriesModal(false)}
                      actions={
                        <Button color="secondary" onClick={() => setShowNoCategoriesModal(false)}>
                          <FormattedMessage
                            id="ui.onBoardingWidget.ai.no.categories.cancel"
                            defaultMessage="ui.onBoardingWidget.ai.no.categories.cancel"
                          />
                        </Button>
                      }>
                      <Button color="primary" onClick={handleCategoriesClick} startIcon={<Icon fontSize="small">edit</Icon>}>
                        <FormattedMessage id="ui.onBoardingWidget.ai.no.categories.link" defaultMessage="ui.onBoardingWidget.ai.no.categories.link" />
                      </Button>
                    </BaseDialog>
                  )}
                  {showCategoriesWarningModal && (
                    <DialogRoot
                      className={classes.dialogRoot}
                      title={
                        <FormattedMessage
                          id="ui.onBoardingWidget.ai.categories.warning.title"
                          defaultMessage="ui.onBoardingWidget.ai.categories.warning.title"
                        />
                      }
                      DialogContentProps={{dividers: false}}
                      open={showCategoriesWarningModal}
                      onClose={() => setShowWarningCategoriesModal(false)}
                      actions={
                        <>
                          <Button size="small" variant="outlined" color="primary" onClick={() => setShowWarningCategoriesModal(false)}>
                            <FormattedMessage
                              id="ui.onBoardingWidget.ai.categories.warning.button.close"
                              defaultMessage="ui.onBoardingWidget.ai.categories.warning.button.close"
                            />
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => startStep(SCOnBoardingStepIdType.CATEGORIES)}
                            endIcon={<Icon fontSize="small">magic_wand</Icon>}>
                            <FormattedMessage
                              id="ui.onBoardingWidget.ai.categories.warning.button.generate"
                              defaultMessage="ui.onBoardingWidget.ai.categories.warning.button.generate"
                            />
                          </Button>
                        </>
                      }>
                      <Typography className={classes.dialogContent}>
                        <FormattedMessage
                          id="ui.onBoardingWidget.ai.categories.warning.info"
                          defaultMessage="ui.onBoardingWidget.ai.categories.warning.info"
                        />
                        <FormattedMessage
                          id="ui.onBoardingWidget.ai.categories.warning.confirm"
                          defaultMessage="ui.onBoardingWidget.ai.categories.warning.confirm"
                          values={{
                            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                            // @ts-ignore
                            b: (chunks) => <b>{chunks}</b>
                          }}
                        />
                      </Typography>
                    </DialogRoot>
                  )}
                </Box>
              </CardContent>
            )}
          </Widget>
        </AccordionDetails>
      </AccordionRoot>
    </Root>
  );
};

export default OnBoardingWidget;

import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography} from '@mui/material';
import {Link, SCFeedUnitActivityType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';
import {grey} from '@mui/material/colors';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {getRouteData} from '../../../../utils/contribute';

const messages = defineMessages({
  comment: {
    id: 'ui.notification.comment.comment',
    defaultMessage: 'ui.notification.comment.comment'
  }
});

const PREFIX = 'SCCommentRelevantActivity';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiIcon-root': {
    fontSize: '18px',
    marginBottom: '0.5px'
  },
  '& a': {
    textDecoration: 'none',
    color: grey[900]
  }
}));

export interface CommentRelevantActivityProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Activity object
   * @default null
   */
  activityObject: SCFeedUnitActivityType;
  /**
   * Index
   * @default null
   */
  index: number;
  /**
   * On vote function
   * @default null
   */
  onVote: (i, v) => void;
  /**
   * The id of the loading vote
   * @default null
   */
  loadingVote: number;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function CommentRelevantActivity(props: CommentRelevantActivityProps): JSX.Element {
  // PROPS
  const {className = null, activityObject = null, index = null, onVote = null, loadingVote = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders root object (if obj)
   */
  if (!activityObject) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)}>
            <Avatar alt={activityObject.author.username} variant="circular" src={activityObject.author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)}>{activityObject.author.username}</Link>{' '}
              {intl.formatMessage(messages.comment, {
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Link to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(activityObject.comment))} sx={{textDecoration: 'underline'}}>
                <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: activityObject.comment.summary}} />
              </Link>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <DateTimeAgo date={activityObject.active_at} />
                  <Bullet sx={{paddingLeft: '10px', paddingTop: '1px'}} />
                  <LoadingButton
                    variant={'text'}
                    sx={{marginTop: '-1px', minWidth: '30px'}}
                    onClick={() => onVote(index, activityObject.comment)}
                    disabled={loadingVote !== null}
                    loading={loadingVote === index}>
                    {activityObject.comment.voted ? (
                      <Tooltip
                        title={<FormattedMessage id={'ui.notification.comment.voteDown'} defaultMessage={'ui.notification.comment.voteDown'} />}>
                        <Icon fontSize={'small'} color="primary">
                          thumb_up_alt
                        </Icon>
                      </Tooltip>
                    ) : (
                      <Tooltip title={<FormattedMessage id={'ui.notification.comment.voteUp'} defaultMessage={'ui.notification.comment.voteUp'} />}>
                        <Icon fontSize={'small'}>thumb_up_off_alt</Icon>
                      </Tooltip>
                    )}
                  </LoadingButton>
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  );
}

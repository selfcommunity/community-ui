import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import {Button, CardActions, Chip, Typography} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/react-core';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const PREFIX = 'SCLoyaltyProgram';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  actions: `${PREFIX}-actions`,
  points: `${PREFIX}-points`,
  discoverMore: `${PREFIX}-discover-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface LoyaltyProgramProps {
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}
/**
 * > API documentation for the Community-JS Loyalty Program component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgram} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgram` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgram-root|Styles applied to the root element.|
 |title.SCLoyaltyProgram-title|Styles applied to the title element.|
 |actions|.SCLoyaltyProgram-actions|Styles applied to the actions section.|
 |points|.SCLoyaltyProgram-points|Styles applied to the points section.|
 |discoverMore|.SCLoyaltyProgram-discover-more|Styles applied to discover more button element.|
 *
 * @param inProps
 */
export default function LoyaltyProgram(inProps: LoyaltyProgramProps): JSX.Element {
  const props: LoyaltyProgramProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {autoHide, className} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [points, setPoints] = useState<number>(null);

  /**
   * Fetches user loyalty points
   */
  function fetchLP() {
    http
      .request({
        url: Endpoints.GetUserLoyaltyPoints.url({id: scUserContext.user['id']}),
        method: Endpoints.GetUserLoyaltyPoints.method
      })
      .then((res: HttpResponse<any>) => {
        setPoints(res.data.points);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * On mount, fetches user loyalty points
   */
  useEffect(() => {
    if (scUserContext.user) {
      fetchLP();
    }
  }, [scUserContext.user]);

  // RENDER
  if (!autoHide && scUserContext.user) {
    return (
      <Root {...props} className={classNames(classes.root, className)}>
        <CardContent>
          <Typography className={classes.title}>
            <FormattedMessage id="ui.loyaltyProgram.title" defaultMessage="ui.loyaltyProgram.title" />
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Typography className={classes.points}>
            <Chip size={'medium'} component="span" label={points} />
            <FormattedMessage id="ui.loyaltyProgram.points" defaultMessage="ui.loyaltyProgram.points" />
          </Typography>
          <Button
            size="small"
            variant="outlined"
            className={classes.discoverMore}
            component={Link}
            to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
          </Button>
        </CardActions>
      </Root>
    );
  }
  return <HiddenPlaceholder />;
}

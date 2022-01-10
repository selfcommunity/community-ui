import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, CardActions, Box, Typography, Grid} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import {AxiosResponse} from 'axios';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import LoyaltyProgramDialog from './LoyaltyProgramDialog';
import {SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/core';
import LoyaltyProgramDetail from './LoyaltyProgramDetail';

const messages = defineMessages({
  points: {
    id: 'ui.loyaltyProgram.points',
    defaultMessage: 'ui.loyaltyProgram.points'
  }
});

const PREFIX = 'SCLoyaltyProgram';

const classes = {
  cardHeader: `${PREFIX}-card-header`,
  pointsIcon: `${PREFIX}-pointsIcon`,
  actions: `${PREFIX}-actions`,
  points: `${PREFIX}-points`,
  pointsBox: `${PREFIX}-points-box`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  padding: 2,
  [`& .${classes.cardHeader}`]: {
    display: 'flex',
    alignItems: 'start',
    flexWrap: 'wrap'
  },
  [`& .${classes.pointsIcon}`]: {
    backgroundColor: theme.palette.grey['A200'],
    padding: 10,
    '& .MuiSvgIcon-root ': {
      fontSize: '3rem',
      color: 'darkRed'
    }
  },
  [`& .${classes.actions}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  [`& .${classes.pointsBox}`]: {
    backgroundColor: 'darkRed',
    padding: 10,
    marginLeft: '-24px'
  },
  [`& .${classes.points}`]: {
    color: 'white',
    fontSize: '1rem'
  }
}));

export default function LoyaltyProgram({
  autoHide = null,
  className = '',
  cardType = null,
  ...props
}: {
  autoHide?: boolean;
  className?: string;
  cardType?: boolean;
}): JSX.Element {
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const [points, setPoints] = useState<number>(null);
  const [openLoyaltyProgramDialog, setOpenLoyaltyProgramDialog] = useState<boolean>(false);
  const intl = useIntl();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const handleClose = () => {
    setOpenLoyaltyProgramDialog(false);
  };

  function fetchLP() {
    http
      .request({
        url: Endpoints.GetUserLoyaltyPoints.url({id: scUserContext.user['id']}),
        method: Endpoints.GetUserLoyaltyPoints.method
      })
      .then((res: AxiosResponse<any>) => {
        setPoints(res.data.points);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchLP();
  }, []);

  const l = (
    <React.Fragment>
      <Typography component="h3" align="left">
        <FormattedMessage id="ui.loyaltyProgram.title" defaultMessage="ui.loyaltyProgram.title" />
      </Typography>
      <CardContent>
        <Grid container spacing={2} className={classes.cardHeader}>
          <Grid item>
            <Box className={classes.pointsIcon}>
              <CardMembershipOutlinedIcon />
            </Box>
          </Grid>
          <Grid item xs={12} sm container>
            <Typography gutterBottom variant="h5" component="div">
              <FormattedMessage id="ui.loyaltyProgram.lp" defaultMessage="ui.loyaltyProgram.lp" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="ui.loyaltyProgram.description" defaultMessage="ui.loyaltyProgram.description" />
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Box component="span" className={classes.pointsBox}>
          <Typography variant="body2" className={classes.points}>
            {`${intl.formatMessage(messages.points, {total: points})}`}
          </Typography>
        </Box>
        {cardType ? (
          <Button variant="outlined" size="small" component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {LoyaltyProgramDetail})}>
            <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
          </Button>
        ) : (
          <Button variant="outlined" size="small" onClick={() => setOpenLoyaltyProgramDialog(true)}>
            <FormattedMessage id="ui.loyaltyProgram.discover" defaultMessage="ui.loyaltyProgram.discover" />
          </Button>
        )}
      </CardActions>
      {openLoyaltyProgramDialog && <LoyaltyProgramDialog open={openLoyaltyProgramDialog} onClose={handleClose} points={points} />}
    </React.Fragment>
  );

  if (!autoHide) {
    return (
      <Root {...props} className={className}>
        <CardContent>{l}</CardContent>
      </Root>
    );
  }
  return null;
}

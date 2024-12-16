import {CardActions, CardContent, Divider, Skeleton, Stack} from '@mui/material';
import {styled} from '@mui/system';
import {Fragment} from 'react';
import 'swiper/css';
import {EventSkeleton} from '../Event';
import Widget from '../Widget';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  content: `${PREFIX}-content`,
  user: `${PREFIX}-user`,
  liveWrapper: `${PREFIX}-live-wrapper`,
  event: `${PREFIX}-event`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot',
  overridesResolver: (_props, styles) => styles.skeletonRoot
})(() => ({}));

export default function UserLiveStreamWidgetSkeleton() {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        {/* <UserSkeleton className={classes.user} elevation={0} /> */}

        <Stack className={classes.liveWrapper}>
          {[1, 2].map((_event, i, array) => (
            <Fragment key={i}>
              <EventSkeleton elevation={0} className={classes.event} />
              {i < array.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Stack>
      </CardContent>

      <CardActions className={classes.actions}>
        <Skeleton animation="wave" width="52px" height="20px" />
      </CardActions>
    </Root>
  );
}

import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid, Hidden} from '@mui/material';
import {GenericSkeleton} from '../Skeleton';
import classNames from 'classnames';

const PREFIX = 'SCFeedSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  [`& .${classes.left}`]: {
    padding: '3px'
  }
}));

interface FeedSkeletonMap {
  /**
   * Skeletons to render into sidebar
   * @default <GenericSkeleton />
   */
  sidebar?: React.ReactElement;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
}

export type FeedSkeletonProps = React.PropsWithChildren<FeedSkeletonMap>;

export default function FeedSkeleton(props: FeedSkeletonProps): JSX.Element {
  // PROPS
  const {
    children = (
      <React.Fragment>
        <GenericSkeleton sx={{mb: 2}} />
        <GenericSkeleton sx={{mb: 2}} />
        <GenericSkeleton sx={{mb: 2}} />
      </React.Fragment>
    ),
    sidebar = <GenericSkeleton />,
    className
  } = props;
  return (
    <Root container spacing={2} className={classNames(classes.root, className)}>
      <Grid item xs={12} md={7}>
        {children}
      </Grid>
      <Hidden smDown>
        <Grid item xs={12} md={5}>
          {sidebar}
        </Grid>
      </Hidden>
    </Root>
  );
}

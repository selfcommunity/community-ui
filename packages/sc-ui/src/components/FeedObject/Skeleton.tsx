import React from 'react';
import Card from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {FeedObjectTemplateType} from '../../types/feedObject';
import {Box, CardContent, CardHeader, CardProps} from '@mui/material';

const PREFIX = 'SCFeedObjectSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  media: `${PREFIX}-media`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.media}`]: {
    height: 190
  }
}));

export interface FeedObjectSkeletonProps extends CardProps {
  /**
   * Feed Object template type
   * @default 'preview'
   */
  template?: FeedObjectTemplateType;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function FeedObjectSkeleton(props: {template?: FeedObjectTemplateType; [p: string]: any}): JSX.Element {
  const {template, ...rest} = props;
  const _template = template || FeedObjectTemplateType.SNIPPET;
  let obj;
  if (_template === FeedObjectTemplateType.PREVIEW || _template === FeedObjectTemplateType.DETAIL) {
    obj = (
      <React.Fragment>
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
          title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <Skeleton animation="wave" variant="rectangular" className={classes.media} />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </React.Fragment>
    );
  } else {
    obj = (
      <React.Fragment>
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
          title={<Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}} />}
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />
        <CardContent>
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        </CardContent>
      </React.Fragment>
    );
  }

  return (
    <Root className={classes.root} {...rest}>
      <Box className={`${PREFIX}-${_template}`}>{obj}</Box>
    </Root>
  );
}

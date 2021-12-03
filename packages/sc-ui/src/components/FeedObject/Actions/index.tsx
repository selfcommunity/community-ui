import React from 'react';
import {styled} from '@mui/material/styles';
import {Grid} from '@mui/material';
import Vote from './Vote';
import Comment from './Comment';
import Share from './Share';
import { SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject } from '@selfcommunity/core';

const PREFIX = 'SCFeedObjectActions';

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  margin: '13px 0',
  color: '#3A3A3A'
}));

export default function Actions({
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  if (!obj) {
    return null;
  }
  return (
    <Root container>
      <Grid item xs={4} sx={{textAlign: 'center'}}>
        <Vote feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} inlineAction={false} />
      </Grid>
      <Grid item xs={4} sx={{textAlign: 'center'}}>
        <Comment feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} />
      </Grid>
      <Grid item xs={4} sx={{textAlign: 'center'}}>
        <Share feedObject={obj} feedObjectType={feedObjectType} id={feedObjectId} withAction={true} inlineAction={false} />
      </Grid>
    </Root>
  );
}

import React, {useState} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import UserProfileTemplate from './index';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {UserProfileEdit} from '@selfcommunity/react-ui';
import DialogContent from '@mui/material/DialogContent';
import {Dialog, DialogTitle, IconButton} from '@mui/material';

import UserProfile from './Skeleton';
import Icon from '@mui/material/Icon';

export default {
  title: 'Design System/React TEMPLATES/User Profile',
  component: UserProfile
} as Meta<typeof UserProfile>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Base: StoryObj<typeof UserProfile> = {
  args: {
    userId: 1,
    startActions: <>
      <IconButton>
        <Icon>card_membership</Icon>
      </IconButton>
    </>,
    endActions: <>
      <IconButton>
        <Icon>download</Icon>
      </IconButton>
    </>
  },
  render: (args: any) => {
    const {userId, ...rest} = args;
    const scUserContext: SCUserContextType = useSCUser();

    // STATE
    const [edit, setEdit] = useState<boolean>(false);

    let _userId = userId;
    let isMe = false;
    if (userId === -1) {
      _userId = scUserContext.user ? scUserContext.user.id : 1;
      isMe = true;
    }

    return (
      <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
        <UserProfileTemplate userId={_userId} {...rest} onEditClick={isMe ? () => setEdit(true) : null} />
        {isMe && (
          <Dialog fullWidth open={edit} onClose={() => setEdit(false)} scroll="body" PaperProps={{sx: {mt: '90px', verticalAlign: 'top'}}}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <UserProfileEdit AccordionProps={{elevation: 0}} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
};

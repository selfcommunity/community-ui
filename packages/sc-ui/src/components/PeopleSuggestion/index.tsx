import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import PeopleSuggestionSkeleton from '../Skeleton/PeopleSuggestionSkeleton';
import User from '../User';

const PREFIX = 'SCPeopleSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function SCPeopleSuggestion(): JSX.Element {
  const [users, setUsers] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openPeopleSuggestionDialog, setOpenPeopleSuggestionDialog] = useState<boolean>(false);

  function fetchUserSuggestion() {
    http
      .request({
        url: Endpoints.UserSuggestion.url(),
        method: Endpoints.UserSuggestion.method
      })
      .then((res) => {
        const data = res.data;
        setUsers(data.results);
        setHasMore(data.count > visibleUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function loadUsers() {
    setVisibleUsers((prevVisibleUsers) => prevVisibleUsers + 3);
  }

  useEffect(() => {
    fetchUserSuggestion();
  }, []);

  if (loading) {
    return <PeopleSuggestionSkeleton />;
  }
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">People suggestion</Typography>
        <List>
          {users.slice(0, visibleUsers).map((user: {username: string}, index) => (
            <div key={index}>
              <User contained={false} scUser={user} />
              <Divider />
            </div>
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => loadUsers()}>
            See More
          </Button>
        )}
        {openPeopleSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}

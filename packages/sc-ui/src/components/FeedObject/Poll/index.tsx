import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, Logger, SCFeedObjectType, SCPollChoiceType, SCPollType} from '@selfcommunity/core';
import {CardContent, CardHeader, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import List from '@mui/material/List';
import Choice from './Choice';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {AxiosResponse} from 'axios';

const messages = defineMessages({
  title: {
    id: 'ui.feedObject.poll.title',
    defaultMessage: 'ui.feedObject.poll.title'
  },
  expDate: {
    id: 'ui.feedObject.poll.expDate',
    defaultMessage: 'ui.feedObject.poll.expDate'
  },
  voters: {
    id: 'ui.feedObject.poll.voters',
    defaultMessage: 'ui.feedObject.poll.voters'
  },
  votes: {
    id: 'ui.feedObject.poll.votes',
    defaultMessage: 'ui.feedObject.poll.votes'
  }
});

const PREFIX = 'SCPollObject';

const classes = {
  root: `${PREFIX}-root`,
  poll: `${PREFIX}-poll`,
  voters: `${PREFIX}-voters`,
  votes: `${PREFIX}-votes`,
  title: `${PREFIX}-title`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  background: theme.palette.grey['A100'],
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  '& .MuiCardHeader-root': {
    textAlign: 'center',
    marginTop: '-11px',
    marginLeft: '-11px',
    width: '100%',
    maxHeight: '10px',
    background: theme.palette.grey['A200']
  },
  [`& .${classes.poll}`]: {
    textAlign: 'center'
  },
  [`& .${classes.voters}`]: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
      width: '0.7em',
      marginRight: '5px'
    }
  },
  [`& .${classes.votes}`]: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
      width: '1em',
      marginRight: '5px'
    }
  },
  [`& .${classes.title}`]: {
    textTransform: 'uppercase'
  },
  '& .MuiTypography-root': {
    fontSize: '1rem'
  }
}));

export interface PollObjectProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Poll object
   */
  pollObject: SCPollType;
  /**
   * If `false`, the poll is not votable
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback to sync poll obj of the feedObject
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * Feed object
   */
  feedObject?: SCFeedObjectType;
  /**
   * Any other properties
   * @default any
   */
  [p: string]: any;
}

export default function PollObject(props: PollObjectProps): JSX.Element {
  //  PROPS
  const {className = null, feedObject = null, pollObject = null, disabled = null, onChange = null, ...rest} = props;

  //STATE
  const intl = useIntl();
  const [obj, setObj] = useState<SCPollType>(pollObject);
  const [votes, setVotes] = useState(getVotes());
  const [choices, setChoices] = useState(pollObject.choices);
  const multipleChoices = pollObject['multiple_choices'];
  const [isVoting, setIsVoting] = useState<number>(null);
  const votable = pollObject['closed'];

  /**
   * Handles choice upvote
   */
  const handleVote = (id) => {
    if (multipleChoices) {
      setChoices((prevChoices) => {
        return prevChoices.map((choice) =>
          Object.assign({}, choice, {
            voted: choice.id === id ? true : choice.voted,
            vote_count: choice.id === id ? choice.vote_count + 1 : choice.vote_count
          })
        );
      });
      setVotes((prevVotes) => prevVotes + 1);
    } else {
      let isVoted = false;
      setChoices((prevChoices) => {
        return prevChoices.map((choice) => {
          isVoted = isVoted || choice.voted;
          return Object.assign({}, choice, {
            voted: choice.id === id ? true : false,
            vote_count: choice.id === id ? choice.vote_count + 1 : choice.vote_count > 0 && choice.voted ? choice.vote_count - 1 : choice.vote_count
          });
        });
      });
      !isVoted && setVotes((prevVotes) => prevVotes + 1);
    }
  };

  /**
   * Handles choice unvote
   */
  const handleUnVote = (id) => {
    setChoices((prevChoices) => {
      return prevChoices.map((choice) =>
        Object.assign({}, choice, {
          voted: choice.id === id ? false : choice.voted,
          vote_count: choice.id === id && choice.vote_count > 0 ? choice.vote_count - 1 : choice.vote_count
        })
      );
    });
    setVotes((prevVotes) => prevVotes - 1);
  };

  /**
   * Gets total votes
   */
  function getVotes() {
    const choices = pollObject.choices;
    let totalVotes = 0;
    for (let i = 0; i < choices.length; i++) {
      totalVotes += choices[i].vote_count;
    }
    return totalVotes;
  }

  /**
   * Performs poll vote
   */
  function vote(choiceObj) {
    setIsVoting(choiceObj.id);
    http
      .request({
        url: Endpoints.PollVote.url({id: feedObject.id, type: feedObject['type']}),
        method: Endpoints.PollVote.method,
        data: {
          choice: choiceObj.id
        }
      })
      .then((res: AxiosResponse<any>) => {
        if (choiceObj.voted) {
          handleUnVote(choiceObj.id);
        } else {
          handleVote(choiceObj.id);
        }
        setIsVoting(null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Renders the poll object
   */
  let objElement = <></>;
  if (pollObject) {
    objElement = (
      <>
        <CardHeader title={`${intl.formatMessage(messages.title)}`} className={classes.title} />
        <CardContent>
          <Typography variant="body1" gutterBottom align={'center'}>
            {obj.title}
          </Typography>
          {obj.expiration_at && Date.parse(obj.expiration_at as string) >= new Date().getTime() ? (
            <Typography variant="body2" gutterBottom align={'center'}>
              {`${intl.formatMessage(messages.expDate)}`}
              {`${intl.formatDate(Date.parse(obj.expiration_at as string), {year: 'numeric', month: 'numeric', day: 'numeric'})}`}
            </Typography>
          ) : (
            <Typography variant="body2" gutterBottom align={'center'}>
              <FormattedMessage id="ui.feedObject.poll.closed" defaultMessage="ui.feedObject.poll.closed" />
            </Typography>
          )}
          <List>
            {choices.map((choice: SCPollChoiceType, index) => (
              <Choice
                elevation={0}
                choiceObj={choice}
                key={index}
                feedObject={disabled ? null : feedObject}
                votes={votes}
                vote={vote}
                isVoting={isVoting}
                votable={votable}
              />
            ))}
          </List>
          {multipleChoices ? (
            <div className={classes.votes}>
              <ListOutlinedIcon />
              <Typography>{`${intl.formatMessage(messages.votes, {total: votes})}`}</Typography>
            </div>
          ) : (
            <div className={classes.voters}>
              <PeopleAltOutlinedIcon />
              <Typography>{`${intl.formatMessage(messages.voters, {total: votes})}`}</Typography>
            </div>
          )}
        </CardContent>
      </>
    );
  }

  /**
   * Renders root element
   */
  return (
    <Root className={className} {...rest}>
      {objElement}
    </Root>
  );
}

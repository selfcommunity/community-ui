import React, {ReactElement, useCallback, useEffect, useMemo} from 'react';
import {Box, BoxProps, IconButton, Typography, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCMediaType} from '@selfcommunity/types';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {ReactSortable} from 'react-sortablejs';
import {PREFIX} from './constants';
import filter from './filter';
import {MEDIA_TYPE_DOCUMENT} from '../../../constants/Media';
import {SCThemeType} from '@selfcommunity/react-core';
import ScrollContainer from '../../ScrollContainer';

const classes = {
  previewRoot: `${PREFIX}-preview-root`,
  media: `${PREFIX}-media`,
  delete: `${PREFIX}-delete`,
  title: `${PREFIX}-title`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot'
})(() => ({}));

export interface PreviewComponentProps extends Omit<BoxProps, 'value' | 'onChange'> {
  onChange: (value: SCMediaType[]) => void;
  value: SCMediaType[];
}

const SORTABLE_ID = 'file_sort';

const PreviewComponent = React.forwardRef((props: PreviewComponentProps, ref: React.Ref<unknown>): ReactElement => {
  // PROPS
  const {className, onChange, value = [], ...rest} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // MEMO
  const medias = useMemo(() => value.filter(filter), [value]);

  // EFFECTS
  useEffect(() => {
    if (typeof document === undefined) {
      return null;
    }
    const sortable = document.getElementById(SORTABLE_ID);
    if (sortable) {
      sortable.scrollLeft = sortable.scrollWidth;
    }
  }, [medias]);

  // HANDLERS
  const handleSort = useCallback(
    (medias: SCMediaType[]) => {
      onChange && onChange([...value.filter((media: any) => medias.findIndex((m: any) => m.id === media.id) === -1), ...medias]);
    },
    [onChange, value]
  );
  const handleDelete = useCallback(
    (id: number) => () => onChange && onChange(value.filter((media: SCMediaType) => media.id !== id)),
    [onChange, value]
  );

  // RENDER
  const mediaElements = useMemo(
    () =>
      medias.map((media) => (
        <Box
          key={media.id}
          className={classes.media}
          sx={{backgroundImage: `url(${media?.image_thumbnail ? media.image_thumbnail.url : media.image})`}}>
          <IconButton className={classes.delete} onClick={handleDelete(media.id)} size="small">
            <Icon>delete</Icon>
          </IconButton>
          {media.title && (
            <Typography className={classes.title}>
              {media.type === MEDIA_TYPE_DOCUMENT && <Icon>picture_as_pdf</Icon>}
              {media.title}
            </Typography>
          )}
        </Box>
      )),
    [medias]
  );
  return (
    <Root ref={ref} className={classNames(className, classes.previewRoot)} {...rest}>
      {medias.length > 0 &&
        (isMobile ? (
          <Box id={SORTABLE_ID}>{mediaElements}</Box>
        ) : (
          <ReactSortable
            list={medias}
            setList={handleSort}
						scroll
						animation={200}
              scrollSensitivity={50}>
            {mediaElements}
          </ReactSortable>
        ))}
    </Root>
  );
});

export default PreviewComponent;

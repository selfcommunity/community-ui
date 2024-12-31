const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCCourseDashboard-header-img': {
        width: '100%',
        height: '150px',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        marginBottom: '17px',

        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      },
      '& .SCCourseDashboard-header-outer-wrapper': {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing(3),
        marginBottom: '19px',

        '& .SCCourseDashboard-header-inner-wrapper': {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '28px',

          '& .SCCourseDashboard-header-icon-wrapper': {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1)
          }
        }
      }
    }),
    skeletonRoot: () => ({})
  }
};

export default Component;

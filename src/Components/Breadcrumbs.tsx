import React, { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import BreadcrumbsMUI from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
import { styled } from '../Styles/stitches.config';

type CompProps = {
  prevPages: {
    title: string;
    to: string;
    icon: ReactElement<IconType, IconType>;
  }[];

  actualPage: {
    title: string;
  };
};

const BreadcrumbsDiv = styled('div', {
  position: 'relative',
  top: '90px',
  marginBottom: '20px',
  width: '100%',
  padding: '10px',
  background: '#2E2E2E',
  borderRadius: '5px',
  boxShadow: '4px 3px 15px 0px rgba(0,0,0,0.25)',
  border: '5px solid #303133',
});

const BreadcrumbsSeparator = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& svg': {
    marginRight: '4px',
    fontSize: '18px',
  },

  '& a': {
    color: 'inherit',
    textDecoration: 'none',
    transition: 'all 0.5s ease-in-out',
    textAlign: 'center',
  },

  '& a:hover': {
    textDecoration: 'underline',
  },
});

function Breadcrumbs({ prevPages, actualPage }: CompProps) {
  return (
    <BreadcrumbsDiv>
      <BreadcrumbsMUI separator=">>" aria-label="breadcrumb">
        {prevPages.map(prevPage => (
          <BreadcrumbsSeparator key={prevPage.to}>
            {prevPage.icon}
            <Link to={prevPage.to}>{prevPage.title}</Link>
          </BreadcrumbsSeparator>
        ))}

        <BreadcrumbsSeparator>
          <Typography fontWeight="bold" color="text.primary">
            {actualPage.title}
          </Typography>
        </BreadcrumbsSeparator>
      </BreadcrumbsMUI>
    </BreadcrumbsDiv>
  );
}

export default Breadcrumbs;

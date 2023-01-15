import React from 'react';
import CategoriesCards from '../../../Components/Home/CategoriesCards';
import { Container } from '../../../Components/Useful/Container';
import { ContainerContent } from '../../../Components/Useful/ContainerContent';

function Categories() {
  return (
    <Container>
      <ContainerContent>
        <CategoriesCards />
      </ContainerContent>
    </Container>
  );
}

export default Categories;

import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getAllIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';
import { useLocation, useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const isInModal = location.state?.background ? true : false;

  const { id } = useParams();

  const ingredientData = useSelector(getAllIngredients).find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI
      ingredientData={ingredientData}
      isInModal={isInModal}
    />
  );
};

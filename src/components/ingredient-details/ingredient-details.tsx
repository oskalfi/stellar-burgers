import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getAllIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';

type TIngredientDetailsProps = {
  isInModal?: boolean;
};

export const IngredientDetails: FC<TIngredientDetailsProps> = ({
  isInModal
}) => {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const onClick = () => {
    if (backgroundLocation?.pathname) {
      navigate(backgroundLocation.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const ingredientData = useSelector(getAllIngredients).find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return isInModal ? (
    <Modal onClose={onClick} title={'Детали ингредиента'}>
      <IngredientDetailsUI
        ingredientData={ingredientData}
        isInModal={isInModal}
      />
    </Modal>
  ) : (
    <IngredientDetailsUI
      ingredientData={ingredientData}
      isInModal={isInModal}
    />
  );
};

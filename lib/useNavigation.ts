import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = useCallback(() => {
    // Tenta voltar no histórico
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Se não houver histórico, volta para home
      navigate('/home');
    }
  }, [navigate]);

  const goToHome = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const goToAbsences = useCallback(() => {
    navigate('/absences');
  }, [navigate]);

  const goToMoments = useCallback(() => {
    navigate('/moments');
  }, [navigate]);

  const goToLetterWrite = useCallback(() => {
    navigate('/letter/write');
  }, [navigate]);

  const goToMomentCreate = useCallback(() => {
    navigate('/moment/create');
  }, [navigate]);

  return {
    goBack,
    goToHome,
    goToAbsences,
    goToMoments,
    goToLetterWrite,
    goToMomentCreate,
    currentPath: location.pathname,
  };
};

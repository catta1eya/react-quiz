import { useQuiz } from "../contexts/QuizContext";

const NextButton = () => {
  const { handleNext, answer, isLastQuestion } = useQuiz();

  if (answer === null) return;

  return (
    <button className="btn btn-ui" onClick={handleNext}>
      {!isLastQuestion ? "Next" : "Finish"}
    </button>
  );
};

export default NextButton;

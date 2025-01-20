import { useQuiz } from "../contexts/QuizContext";

const StartScreen = () => {
  const { numQuestions, handleStart } = useQuiz();
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button className="btn btn-ui" onClick={handleStart}>
        Let&apos;s start
      </button>
    </div>
  );
};

export default StartScreen;

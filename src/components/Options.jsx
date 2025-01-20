import { useQuiz } from "../contexts/QuizContext";

const Options = ({ question }) => {
  const { answer, handleNewAnswer } = useQuiz();
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option 
            ${index === answer ? "answer" : ""} 
            ${
              hasAnswered
                ? index === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => handleNewAnswer(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Options;

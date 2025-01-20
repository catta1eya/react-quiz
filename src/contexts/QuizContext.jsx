import { createContext, useContext, useEffect, useReducer } from "react";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
};

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, cur) => (acc += cur.points),
    0
  );
  const isLastQuestion = index === numQuestions - 1;

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => handleDataLoaded(data))
      .catch(handleDataFailed);
  }, []);

  const handleDataLoaded = (data) => {
    dispatch({ type: "dataReceived", payload: data });
  };

  const handleDataFailed = () => {
    dispatch({ type: "dataFailed" });
  };

  const handleStart = () => {
    dispatch({ type: "start" });
  };

  const handleNewAnswer = (index) => {
    dispatch({ type: "newAnswer", payload: index });
  };

  const handleNext = () => {
    if (!isLastQuestion) dispatch({ type: "nextQuestion" });
    else dispatch({ type: "finish" });
  };

  const handleTick = () => {
    dispatch({ type: "tick" });
  };

  const handleRestart = () => {
    dispatch({ type: "restart" });
  };

  const value = {
    status,
    numQuestions,
    questions,
    answer,
    index,
    secondsRemaining,
    isLastQuestion,
    points,
    maxPossiblePoints,
    highscore,
    handleDataLoaded,
    handleDataFailed,
    handleStart,
    handleNewAnswer,
    handleNext,
    handleTick,
    handleRestart,
  };
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

const useQuiz = () => useContext(QuizContext);

export { QuizProvider, useQuiz };

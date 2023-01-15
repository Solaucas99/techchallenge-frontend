import React, { useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NotFound from './Components/NotFound';
import About from './Pages/about/About';

import CategoriesIndex from './Pages/admin/challenges/categories/CategoriesIndex';
import CreateCodeCompleteChallengeIndex from './Pages/admin/challenges/categories/code_complete/create/CreateCodeCompleteChallengeIndex';
import CreateHTMLChallengeIndex from './Pages/admin/challenges/categories/html/create/CreateHTMLChallengeIndex';
import CreateJSChallengeIndex from './Pages/admin/challenges/categories/js/create/CreateJSChallengeIndex';
import CreateQuizChallengeIndex from './Pages/admin/challenges/categories/quiz/create/CreateQuizChallengeIndex';
// import Challenge from './Pages/Challenge';
import Categories from './Pages/challenges/categories/Categories';
import CodeCompleteChallengesListIndex from './Pages/challenges/categories/code_complete/CodeCompleteChallengesListIndex';
import SendCodeCompleteSolutionIndex from './Pages/challenges/categories/code_complete/SendCodeCompleteSolutionIndex';
import HTMLChallengesListIndex from './Pages/challenges/categories/html/HTMLChallengesListIndex';
import SendHTMLSolutionIndex from './Pages/challenges/categories/html/SendHTMLSolutionIndex';
import HTMLSolutions from './Pages/challenges/categories/html/solutions/HTMLSolutions';
import JSChallengesListIndex from './Pages/challenges/categories/js/JSChallengesListIndex';
import SendJSSolutionIndex from './Pages/challenges/categories/js/SendJSSolutionIndex';
import JSSolutions from './Pages/challenges/categories/js/solutions/JSSolutions';
import QuizChallengesListIndex from './Pages/challenges/categories/quiz/QuizChallengesListIndex';
import SendQuizSolutionIndex from './Pages/challenges/categories/quiz/SendQuizSolutionIndex';
import Home from './Pages/Home';
import RankingIndex from './Pages/ranking/RankingIndex';
import Dashboard from './Pages/user/Dashboard';
import Logout from './Pages/user/Logout';
import UserLoginOrSignUp from './Pages/user/UserLoginOrSignUp';
import { useUserContextProvider } from './Providers/UserContextProvider';

export function AppRoutes() {
  const { userContext } = useUserContextProvider();

  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/challenges/categories" element={<Categories />} />

      <Route
        path="/challenges/categories/js/:id"
        element={
          userContext.is_logged_in ? (
            <SendJSSolutionIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />
      <Route
        path="/challenges/categories/js/:id/solutions"
        element={
          userContext.is_logged_in ? (
            <JSSolutions />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />
      <Route
        path="/challenges/categories/js"
        element={
          userContext.is_logged_in ? (
            <JSChallengesListIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />

      <Route
        path="/challenges/categories/html/:id"
        element={
          userContext.is_logged_in ? (
            <SendHTMLSolutionIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />
      <Route
        path="/challenges/categories/html/:id/solutions"
        element={
          userContext.is_logged_in ? (
            <HTMLSolutions />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />
      <Route
        path="/challenges/categories/html"
        element={
          userContext.is_logged_in ? (
            <HTMLChallengesListIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />

      <Route
        path="/challenges/categories/quiz/:id"
        element={
          userContext.is_logged_in ? (
            <SendQuizSolutionIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />
      <Route
        path="/challenges/categories/quiz"
        element={
          userContext.is_logged_in ? (
            <QuizChallengesListIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />

      <Route
        path="/challenges/categories/code-complete/:id"
        element={
          userContext.is_logged_in ? (
            <SendCodeCompleteSolutionIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />
      <Route
        path="/challenges/categories/code-complete"
        element={
          userContext.is_logged_in ? (
            <CodeCompleteChallengesListIndex />
          ) : (
            <Navigate to="/user/login" replace />
          )
        }
      />

      {userContext.is_logged_in && userContext.is_admin && (
        <>
          <Route
            path="/admin/challenges/categories"
            element={<CategoriesIndex />}
          />
          <Route
            path="/admin/challenges/categories/js/create"
            element={<CreateJSChallengeIndex />}
          />
          <Route
            path="/admin/challenges/categories/html/create"
            element={<CreateHTMLChallengeIndex />}
          />
          <Route
            path="/admin/challenges/categories/quiz/create"
            element={<CreateQuizChallengeIndex />}
          />
          <Route
            path="/admin/challenges/categories/code-complete/create"
            element={<CreateCodeCompleteChallengeIndex />}
          />
        </>
      )}

      <Route
        path="/user/login"
        element={
          !userContext.is_logged_in ? (
            <UserLoginOrSignUp />
          ) : (
            <Navigate to="/page-not-found" replace />
          )
        }
      />

      <Route
        path="/user/logout"
        element={
          userContext.is_logged_in ? (
            <Logout />
          ) : (
            <Navigate to="/page-not-found" replace />
          )
        }
      />

      <Route
        path="/ranking"
        element={
          userContext.is_logged_in ? (
            <RankingIndex />
          ) : (
            <Navigate to="/page-not-found" replace />
          )
        }
      />

      <Route
        path="/user/dashboard"
        element={
          userContext.is_logged_in ? (
            <Dashboard />
          ) : (
            <Navigate to="/page-not-found" replace />
          )
        }
      />

      <Route path="/page-not-found" element={<NotFound />} />

      <Route path="*" element={<Navigate to="/page-not-found" replace />} />
    </Routes>
  );
}

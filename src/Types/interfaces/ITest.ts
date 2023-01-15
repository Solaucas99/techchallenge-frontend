export interface ITest {
  code: string;
  challenge_id: string;
  user_id: string;
  challenge_type: 'html' | 'js';
}

type TestError = {
  expected: number;
  message: string;
  operator: string;
  showDiff: boolean;
  stack: string;
};

type TestDetails = {
  currentRetry: number;
  duration: number;
  err: TestError;
  file: string;
  fullTitle: string;
  title: string;
  speed?: string;
};

interface Stats {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  start?: Date | undefined;
  end?: Date | undefined;
  duration?: number | undefined;
}

export interface IMochaTestJSON {
  stats: Stats;
  failures: TestDetails[];
  passes: TestDetails[];
  pending: TestDetails[];
  tests: TestDetails[];
}

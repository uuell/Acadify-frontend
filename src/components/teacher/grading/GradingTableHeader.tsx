
import type { GradingTest } from "./gradingUtils";
import { getTestsByTerm } from "./gradingUtils";
import DeleteTestButton from "./DeleteTestButton";

interface GradingTableHeaderProps {
  tests: GradingTest[];
  terms: string[];
  onDeleteTest: (testId: number) => void;
  deletingTestId: number | null;
}

export default function GradingTableHeader({
  tests,
  terms,
  onDeleteTest,
  deletingTestId,
}: GradingTableHeaderProps) {
  const hasTerms = terms.length > 0;

  return (
    <thead>
      <tr>
        <th className="grading-sticky-name">Student Name</th>
        <th className="grading-sticky-id">ID Number</th>

        {hasTerms
          ? terms.map((term) => (
              <th
                key={term}
                colSpan={getTestsByTerm(tests, term).length + 1}
                className="grading-term-header"
              >
                {term}
              </th>
            ))
          : tests.map((test) => (
              <th key={test.id} className="grading-activity-header">
                <ActivityHeader
                  test={test}
                  onDeleteTest={onDeleteTest}
                  deletingTestId={deletingTestId}
                />
              </th>
            ))}

        <th className="grading-overall-header">Overall</th>
      </tr>

      {hasTerms && (
        <tr>
          <th className="grading-sticky-name" />
          <th className="grading-sticky-id" />

          {terms.map((term) => (
            <TermHeaders
              key={term}
              term={term}
              tests={getTestsByTerm(tests, term)}
              onDeleteTest={onDeleteTest}
              deletingTestId={deletingTestId}
            />
          ))}

          <th />
        </tr>
      )}
    </thead>
  );
}

function TermHeaders({
  term,
  tests,
  onDeleteTest,
  deletingTestId,
}: {
  term: string;
  tests: GradingTest[];
  onDeleteTest: (testId: number) => void;
  deletingTestId: number | null;
}) {
  return (
    <>
      {tests.map((test) => (
        <th
          key={test.id}
          className="grading-activity-header"
          title={test.component_tag ?? ""}
        >
          <ActivityHeader
            test={test}
            onDeleteTest={onDeleteTest}
            deletingTestId={deletingTestId}
          />
        </th>
      ))}

      <th className="grading-term-grade-header" title={`${term} Grade`}>
        Grade
      </th>
    </>
  );
}

function ActivityHeader({
  test,
  onDeleteTest,
  deletingTestId,
}: {
  test: GradingTest;
  onDeleteTest: (testId: number) => void;
  deletingTestId: number | null;
}) {
  return (
    <div>
      <span>{test.title}</span>

      <DeleteTestButton
        testId={test.id}
        testTitle={test.title}
        deleting={deletingTestId !== null}
        onDelete={onDeleteTest}
      />
    </div>
  );
}

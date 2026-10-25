
export interface GradingComponent {
    name: string;
    weight: number;
}

interface TeacherGradingFormulaProps {
    components: GradingComponent[];
    onComponentsChange: (components: GradingComponent[]) => void;
}
function TeacherGradingFormula({
    components,
    onComponentsChange,
}: TeacherGradingFormulaProps) {
    const totalWeight = components.reduce(
        (sum, component) => sum + component.weight,
        0,
    );

    function updateComponent(
        index: number,
        field: keyof GradingComponent,
        value: string,
    ) {
        onComponentsChange(
            components.map((component, currentIndex) => {
                if (currentIndex !== index) return component;

                if (field === "weight") {
                    return { ...component, weight: Number(value) };
                }

                return { ...component, name: value };
            }),
        );
    }

    function addComponent() {
        onComponentsChange([
            ...components,
            { name: "", weight: 0 },
        ]);
    }

    function removeComponent(index: number) {
        onComponentsChange(
            components.filter((_, currentIndex) => currentIndex !== index),
        );
    }

    return (
        <div className="teacher-grading-formula">
            <div className="teacher-grading-formula-heading">
                <div>
                    <h3>Grading Formula</h3>
                    <p>Define the components and their percentage weights.</p>
                </div>
            </div>

            <div className="teacher-grading-components">
                {components.map((component, index) => (
                    <div className="teacher-grading-component" key={index}>
                        <input
                            type="text"
                            className="teacher-class-form-input"
                            placeholder="Component name"
                            aria-label={`Component ${index + 1} name`}
                            required
                            value={component.name}
                            onChange={(event) =>
                                updateComponent(index, "name", event.target.value)
                            }
                        />

                        <div className="teacher-grading-weight">
                            <input
                                type="number"
                                min={0}
                                max={100}
                                step="any"
                                className="teacher-class-form-input"
                                aria-label={`Component ${index + 1} weight`}
                                required
                                value={component.weight}
                                onChange={(event) =>
                                    updateComponent(index, "weight", event.target.value)
                                }
                            />
                            <span>%</span>
                        </div>

                        <button
                            type="button"
                            className="teacher-grading-remove"
                            onClick={() => removeComponent(index)}
                            aria-label={`Remove component ${index + 1}`}
                            title="Remove component"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="teacher-grading-add"
                onClick={addComponent}
            >
                + Add Component
            </button>

            <p
                className={`teacher-grading-total ${Math.abs(totalWeight - 100) < 0.001
                        ? "valid"
                        : "invalid"
                    }`}
            >
                Total Weight: {totalWeight.toFixed(2)}%
                {Math.abs(totalWeight - 100) < 0.001
                    ? " ✓"
                    : " — Must equal 100%"}
            </p>

        </div>
    );
}

export default TeacherGradingFormula;

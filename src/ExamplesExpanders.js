const defualtExpander = require("cucumon/src/ExamplesExpander")

function exampleNumberAddingExpander(template, examples) {
    const scenarios = defualtExpander(template, examples);
    scenarios.forEach((scenario, index)=>{
        scenario.statement += ` (example #${index + 1})`;
    });
    return scenarios;
}

class ExamplesIterator {
    constructor(examples) {
        this.examples = examples;
        this.examplesIndex = 0;
        this.exampleIndex = 0;
        this.header = this.examples[this.examplesIndex].rows[0].cells;
    }

    next() {
        if (this.examples[this.examplesIndex].rows.length > ++this.exampleIndex)
            return this.examples[this.examplesIndex].rows[this.exampleIndex];
        if (this.examples.length <= this.examplesIndex + 1)
            return null;
        this.examplesIndex++;
        this.exampleIndex = 0;
        return this.next();
    }
}

function exampleDetailsAddingExpander(template, examples) {
    const scenarios = defualtExpander(template, examples);
    const ite = new ExamplesIterator(examples);

    scenarios.forEach((scenario, index)=>{
        const example = ite.next();
        if (!example) return;
        const detail = ite.header.map((key, index) => `${key}=${example.cells[index]}`).join(', ');
        scenario.statement += ` (examples#${ite.examplesIndex + 1}, ${detail})`;
    });
    return scenarios;
}

function getExpander(style) {
    if (style == "number") return exampleNumberAddingExpander;
    if (style == "detail") return exampleDetailsAddingExpander;
}

module.exports = getExpander;

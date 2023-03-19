export default class AmendableRollEditor extends FormApplication {
    constructor(object={},options={}) {
        super(object,options);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'pf2-amendable-roll-editor',
            classes:["pf2e-amendable-rolls"],
            template: "modules/pf2e-amendable-rolls/templates/apps/editor.hbs",
            width: 500,
            height: "auto"
        });
    }

    async getData() {
        const data = {};

        data.obj = this.object;

        console.log(this.object);
        data.adjust = 0;
            let roll = this.object.rolls[0];
            let term = roll.terms.find(t => t.flavor == "adjust") ?? false;
        if (term) {
            data.adjust = parseInt(term.number);
        }

    

        return data;
    }

    async _updateObject(event, formData) {

        // let obj = foundry.utils.duplicate(this.object)
        console.log(formData);
        // upate rolls
    }

    activateListeners(html) {

        html.on("click", "[data-action]", async (ev) => {
            let action = ev.currentTarget.dataset.action

            let roll = this.object.rolls[0];

            let term = roll.terms.find(t => t.flavor == "adjust") ?? false;

            if (!term) {
                term = new NumericTerm({number: 0, options:{flavor: "adjust"}});
                roll.terms.push(new OperatorTerm({operator:"+"}))
                roll.terms.push(term);
            }

            if (action == "inc") {
                term.number += 1;
            }
            if (action == "dec") {
                term.number -= 1;
            }

            roll._total = roll._evaluateTotal();


            await this.object.update({
                rolls: duplicate(this.object.rolls)
            })
            this.render(true);
        })

    }
}
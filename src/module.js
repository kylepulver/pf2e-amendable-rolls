import AmendableRollEditor from "./applications/editor.js";

const MODULE_ID = 'malleable-rolls';

Hooks.on('init', () => {
    console.log("Malleable Rolls: Initialized");
    // libWrapper.register(
    //     MODULE_ID,
        
    // )
})

Hooks.on('getChatLogPF2eEntryContext', (obj, items) => {

    items.push({
        name: "Edit Roll",
        icon: "<i class=\"fa-solid fa-edit\"></i>",
        callback: li => {
            const message = game.messages.get(li.data("messageId"));
            new AmendableRollEditor(message).render(true)
        }
    })

    items.push({
        name: "Append Note",
        icon: "<i class=\"fa-solid fa-file-plus\"></i>",
        callback: li => {
            const message = game.messages.get(li.data("messageId"));
            let notes = message.getFlag("pf2e-amendable-rolls", "notes") ?? [];
            // console.log(notes);
            let content = ""
            let idx = 0;
            for(let n of notes) {
                content += `<div>&bull; ${n.trim()} <i class="fa-solid fa-trash fa-sm" style="opacity:0.5" data-note="${idx}"></i></div>`
                idx += 1;
            }
            content += "<textarea autofocus></textarea>"

            let note = "";
            new Dialog({
                title: "Append Note",
                content: content,
                buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Save",
                    callback: () => {
                    if (note) {
                        notes.push(note);
                        message.setFlag("pf2e-amendable-rolls", "notes", notes);
                    }
                }
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                    callback: () => {}
                }
                },
                default: "one",
                render: html => {
                    html.on("input", "textarea", (ev) => {
                        note = ev.currentTarget.value;
                    })
                    // html.find("textarea").focus();
                    html.on("click", ".fa-trash", (ev) => {
                        let idx = parseInt(ev.currentTarget.dataset.note);


                        notes = notes.filter((v, i) => {
                            return i != idx
                        });
                        message.setFlag("pf2e-amendable-rolls", "notes", notes);
                        let $i = $(ev.currentTarget);
                        $i.closest("div").css("display", "none");
                    })
                }
                // close: html => console.log("This always is logged no matter which option is chosen")
            }).render(true);
            // new MalleableRollNote(message).render(true)
        }
    })

    return items;
})

Hooks.on("renderChatMessage", (obj, html, data) => {
    let notes = obj.getFlag("pf2e-amendable-rolls", "notes") ?? [];
    if (notes.length) {
        for (let n of notes) {
            if (!n.trim()) continue;
            html.append(`<div style="font-size:90%;opacity:0.9;padding:0.1em">&bull; ${n.trim()}</div>`)
        }

    }
})


/*
TODO:
- add "ADJUST" value, recalculate result
- append notes
- edit entire roll
*/
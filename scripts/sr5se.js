import {HOOK_INIT_TEST, HOOK_INIT_STATUS_EFFECTS, MODULE_ID, HOOK_BEFORE_TEST, HOOK_AFTER_TEST} from "./constants.js";
import {initStatusEffects} from "./statusEffects.js";

Hooks.once('init', async function () {
    console.log("SR5 Status Effects Init");

    libWrapper.register(MODULE_ID, "game.shadowrun5e.tests.SuccessTest.prototype.execute", function (next, ...params) {
        console.log("Executing test: ", this);
        Hooks.call(HOOK_INIT_TEST, this);
        Hooks.call(HOOK_BEFORE_TEST, this);
        let result = next(...params);
        Hooks.call(HOOK_AFTER_TEST, this);
        return result;
    }, libWrapper.WRAPPER)

    const statusEffects = [];
    Hooks.callAll(HOOK_INIT_STATUS_EFFECTS, statusEffects)
    CONFIG.statusEffects = statusEffects;

});

Hooks.once(HOOK_INIT_STATUS_EFFECTS, initStatusEffects)

Hooks.once('ready', async function () {
    console.log("SR5 Status Effects Ready")
});

// Hooks.on(HOOK_BEFORE_TEST, test => {
//     console.log("Hooked Test:", test)
// })

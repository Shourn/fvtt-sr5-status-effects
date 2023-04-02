import {HOOK_INIT_TEST} from "./constants.js";

const ICON_PATH = "modules/SR5-status-effects/assets/icons/game-icons/";

function makeStatusEffect(slug, icon, ...hooks) {
    return {
        status: {
            id: slug,
            label: `SR5SE.${slug}`,
            icon: ICON_PATH + icon,
            flags: {
                sr5se: {
                    statusEffect: slug,
                }
            }
        },
        hooks: [...hooks]
    }
}

function withStatus(config, action) {
    return test => {
        if (test.actor.effects.find(effect => effect?.flags?.sr5se?.statusEffect === config.id)) {
            action(test);
        }
    }
}

const fullDefense = makeStatusEffect("FullDefense", "shield.svg", (config) => {
    Hooks.on(HOOK_INIT_TEST, withStatus(config, test => {
        if (test.data.type === "PhysicalDefenseTest") {
            test.data.activeDefense = "full_defense"
        }
    }));
});

const fullCover = makeStatusEffect("FullCover", "brick-wall.svg", (config) => {
    Hooks.on(HOOK_INIT_TEST, withStatus(config, test => {
        if (test.data.type === "PhysicalDefenseTest") {
            if (test.data.cover < 4) {
                test.data.cover = 4;
            }
        }
    }));
})

const halfCover = makeStatusEffect("HalfCover", "broken-wall.svg", (config) => {
    Hooks.on(HOOK_INIT_TEST, withStatus(config, test => {
        if (test.actor.effects.find(effect => effect?.flags?.sr5se?.statusEffect === "FullCover")) {
            return;
        }
        if (test.data.type === "PhysicalDefenseTest") {
            if (test.data.cover < 2) {
                test.data.cover = 2;
            }
        }
    }));
})

// const bleedout = makeStatusEffect("Bleedout", "bleeding-wound.svg");
// const blinded = makeStatusEffect("Blinded", "sight-disabled.svg");
// const brokenGrip = makeStatusEffect("BrokenGrip", "cut-palm.svg");
// const buckled = makeStatusEffect("Buckled", "oppression.svg");
// const deafeaned = makeStatusEffect("Deafened", "hearing-disabled.svg");
// const fatigued = makeStatusEffect("Fatigued", "despair.svg");
// const knockdown = makeStatusEffect("Knockdown", "falling.svg");
// const nauseous = makeStatusEffect("Nauseous", "vomiting.svg");
// const oneArmBandit = makeStatusEffect("OneArmBandit", "arm-sling.svg");
// const slowDeath = makeStatusEffect("SlowDeath", "internal-injury.svg");
// const slowed = makeStatusEffect("Slowed", "snail.svg");
// const stunned = makeStatusEffect("Stunned", "knockout.svg");
// const unableToSpeak = makeStatusEffect("UnableToSpeak", "silenced.svg");
// const weakSide = makeStatusEffect("WeakSide", "arm-bandage.svg");
// const winded = makeStatusEffect("Winded", "walk.svg");

const STATUS_EFFECTS = {
    fullDefense,
    fullCover,
    halfCover,
    // bleedout,
    // blinded,
    // brokenGrip,
    // buckled,
    // deafeaned,
    // fatigued,
    // knockdown,
    // nauseous,
    // oneArmBandit,
    // slowDeath,
    // slowed,
    // stunned,
    // unableToSpeak,
    // weakSide,
    // winded
}

export function initStatusEffects(statusEffects) {
    for (const statusEffect in STATUS_EFFECTS) {
        let effectConfig = STATUS_EFFECTS[statusEffect];
        effectConfig.hooks.forEach(hook => hook(effectConfig.status))
        statusEffects.push(effectConfig.status);
    }
}

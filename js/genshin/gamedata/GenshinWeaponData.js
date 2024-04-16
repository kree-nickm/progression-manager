export default {
    "AThousandFloatingDreams": {
        "name": "A Thousand Floating Dreams",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Plate",
        "matStrongEnemy": "Primal Constructs",
        "matWeakEnemy": "Fungi",
        "baseATK": 44,
        "stat": "eleMas",
        "baseStat": 58,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4c\/Weapon_A_Thousand_Floating_Dreams.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e8\/Weapon_A_Thousand_Floating_Dreams_2nd.png"
        ],
        "passive": "Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase Elemental Mastery by @0. If not, increase the equipping character's DMG Bonus from their Elemental Type by @1%. Each of the aforementioned effects can have up to 3 stacks. Additionally, all nearby party members other than the equipping character will have their Elemental Mastery increased by @2. Multiple such effects from multiple such weapons can stack.",
        "refinementData": [
            {
                "1": 32,
                "2": 40,
                "3": 48,
                "4": 56,
                "5": 64
            },
            {
                "1": 10,
                "2": 14,
                "3": 18,
                "4": 22,
                "5": 26
            },
            {
                "1": 40,
                "2": 42,
                "3": 44,
                "4": 46,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/A_Thousand_Floating_Dreams"
    },
    "AmosBow": {
        "name": "Amos' Bow",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Slimes",
        "baseATK": 46,
        "stat": "atk_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/de\/Weapon_Amos%27_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0d\/Weapon_Amos%27_Bow_2nd.png"
        ],
        "passive": "Increases Normal Attack and Charged Attack DMG by @0%. After a Normal or Charged Attack is fired, DMG dealt increases by a further @1% every 0.1 seconds the arrow is in the air for up to 5 times.",
        "code": [
            [
                "stat",
                [
                    [
                        "normal_dmg_",
                        "charged_dmg_"
                    ],
                    "@0"
                ]
            ],
            [
                "proc",
                [
                    "stat",
                    [
                        [
                            "normal_dmg_",
                            "charged_dmg_"
                        ],
                        "@1"
                    ]
                ],
                5
            ]
        ],
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Amos%27_Bow"
    },
    "AquaSimulacra": {
        "name": "Aqua Simulacra",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Guyun",
        "matStrongEnemy": "Black Serpents",
        "matWeakEnemy": "Specters",
        "baseATK": 44,
        "stat": "critDMG_",
        "baseStat": 19.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/cd\/Weapon_Aqua_Simulacra.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/25\/Weapon_Aqua_Simulacra_2nd.png"
        ],
        "passive": "HP is increased by @0%. When there are opponents nearby, the DMG dealt by the wielder of this weapon is increased by @1%. This will take effect whether the character is on-field or not.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Aqua_Simulacra"
    },
    "AquilaFavonia": {
        "name": "Aquila Favonia",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 48,
        "stat": "physical_dmg_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6a\/Weapon_Aquila_Favonia.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c6\/Weapon_Aquila_Favonia_2nd.png"
        ],
        "passive": "ATK is increased by @0%. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the banner of the resistance aloft, regenerating HP equal to @1% of ATK and dealing @2% of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 100,
                "2": 115,
                "3": 130,
                "4": 145,
                "5": 160
            },
            {
                "1": 200,
                "2": 230,
                "3": 260,
                "4": 290,
                "5": 320
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Aquila_Favonia"
    },
    "BeaconOfTheReedSea": {
        "name": "Beacon of the Reed Sea",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Scarab",
        "matStrongEnemy": "Consecrated Beasts",
        "matWeakEnemy": "Eremites",
        "baseATK": 46,
        "stat": "critRate_",
        "baseStat": 7.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6c\/Weapon_Beacon_of_the_Reed_Sea.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/dc\/Weapon_Beacon_of_the_Reed_Sea_2nd.png"
        ],
        "passive": "After the character's Elemental Skill hits an opponent, their ATK will be increased by @0% for 8s. After the character takes DMG, their ATK will be increased by @1% for 8s. The 2 aforementioned effects can be triggered even when the character is not on the field. Additionally, when not protected by a shield, the character's Max HP will be increased by @2%.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 32,
                "2": 40,
                "3": 48,
                "4": 56,
                "5": 64
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Beacon_of_the_Reed_Sea"
    },
    "CalamityQueller": {
        "name": "Calamity Queller",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 49,
        "stat": "atk_",
        "baseStat": 3.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/8b\/Weapon_Calamity_Queller.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/58\/Weapon_Calamity_Queller_2nd.png"
        ],
        "passive": "Gain @0% All Elemental DMG Bonus. Obtain Consummation for 20s after using an Elemental Skill, causing ATK to increase by @1% per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 3.2,
                "2": 4,
                "3": 4.800000000000001,
                "4": 5.6000000000000005,
                "5": 6.4
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Calamity_Queller"
    },
    "CashflowSupervision": {
        "name": "Cashflow Supervision",
        "type": "Catalyst",
        "rarity": 5,
        "baseATK": 48,
        "stat": "critRate_",
        "passive": "ATK is increased by @0%. When current HP increases or decreases, Normal Attack DMG will be increased by @1% and Charged Attack DMG will be increased by @2% for 4s. Max 3 stacks. This effect can be triggered once every 0.3s. When the wielder has 3 stacks, ATK SPD will be increased by @3%.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 14,
                "2": 17.5,
                "3": 21,
                "4": 24.5,
                "5": 28
            },
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Cashflow_Supervision",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f2\/Weapon_Cashflow_Supervision.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/45\/Weapon_Cashflow_Supervision_2nd.png"
        ],
        "matForgery": "Chalice",
        "matStrongEnemy": "Fatui Operatives",
        "matWeakEnemy": "Fontemer"
    },
    "CranesEchoingCall": {
        "name": "Crane's Echoing Call",
        "type": "Catalyst",
        "rarity": 5,
        "baseATK": 49,
        "stat": "atk_",
        "passive": "After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks will deal @0% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore @1 Energy to the equipping character. Energy can restored this way every 0.7s. This energy regain effect can be triggered even if the equipping character is not on the field.",
        "code": [
            "proc",
            [
                "pstat",
                [
                    "plunging_dmg_",
                    "@0"
                ]
            ],
            "After Plunging Attack"
        ],
        "refinementData": [
            {
                "1": 28,
                "2": 41,
                "3": 54,
                "4": 67,
                "5": 80
            },
            {
                "1": 2.5,
                "2": 2.75,
                "3": 3,
                "4": 3.25,
                "5": 3.5
            }
        ],
        "imgs": [
            "https:\/\/api.ambr.top\/assets\/UI\/UI_EquipIcon_Catalyst_MountainGale.png",
            "https:\/\/api.ambr.top\/assets\/UI\/UI_EquipIcon_Catalyst_MountainGale.png"
        ],
        "matForgery": "Elixir",
        "matStrongEnemy": "Xuanwen Beasts",
        "matWeakEnemy": "Samachurl",
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Crane%27s_Echoing_Call"
    },
    "CrimsonMoonsSemblance": {
        "release": "April 24, 2024",
        "name": "Crimson Moon's Semblance",
        "type": "Polearm",
        "rarity": 5,
        "baseATK": 48,
        "stat": "critRate_",
        "passive": "Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. This effect can be triggered up to once every 14s. In addition, when the equipping character has a Bond of Life, they gain a @0% DMG Bonus; if the value of the Bond of Life is greater than or equal to 30% of Max HP, then gain an additional @1% DMG Bonus.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "dmg_",
                    ["stacks", "@0", "@1"]
                ]
            ],
            "With Bond of Life (1 if <30%; 2 if >=30%)",
            2
        ],
        "refinementData": [
            {
                "1": 12,
                "2": 16,
                "3": 20,
                "4": 24,
                "5": 28
            },
            {
                "1": 24,
                "2": 32,
                "3": 40,
                "4": 48,
                "5": 56
            }
        ],
        "imgs": [
            "https://api.hakush.in/gi/UI/UI_EquipIcon_Pole_BloodMoon.webp",
            "https://api.hakush.in/gi/UI/UI_EquipIcon_Pole_BloodMoon.webp"
        ],
        "matForgery": "Chalice",
        "matStrongEnemy": "Praetorians",
        "matWeakEnemy": "Meka"
    },
    "ElegyForTheEnd": {
        "name": "Elegy for the End",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Tooth",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Fatui",
        "baseATK": 46,
        "stat": "enerRech_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a5\/Weapon_Elegy_for_the_End.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/61\/Weapon_Elegy_for_the_End_2nd.png"
        ],
        "passive": "A part of the \"Millennial Movement\" that wanders amidst the winds.\nIncreases Elemental Mastery by @0.\nWhen the Elemental Skills or Elemental Bursts of the character wielding this weapon hit opponents, that character gains a Sigil of Remembrance. This effect can be triggered once every 0.2s and can be triggered even if said character is not on the field.\nWhen you possess 4 Sigils of Remembrance, all of them will be consumed and all nearby party members will obtain the \"Millennial Movement: Farewell Song\" effect for 12s.\n\"Millennial Movement: Farewell Song\" increases Elemental Mastery by @1 and increases ATK by @2%. Once this effect is triggered, you will not gain Sigils of Remembrance for 20s.\nOf the many effects of the \"Millennial Movement,\" buffs of the same type will not stack.",
        "refinementData": [
            {
                "1": 60,
                "2": 75,
                "3": 90,
                "4": 105,
                "5": 120
            },
            {
                "1": 100,
                "2": 125,
                "3": 150,
                "4": 175,
                "5": 200
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Elegy_for_the_End"
    },
    "EngulfingLightning": {
        "name": "Engulfing Lightning",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Mask",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "Nobushi",
        "baseATK": 46,
        "stat": "enerRech_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/21\/Weapon_Engulfing_Lightning.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/23\/Weapon_Engulfing_Lightning_2nd.png"
        ],
        "passive": "ATK increased by @0% of Energy Recharge over the base 100%. You can gain a maximum bonus of @1% ATK. Gain @2% Energy Recharge for 12s after using an Elemental Burst.",
        "refinementData": [
            {
                "1": 28,
                "2": 35,
                "3": 42,
                "4": 49,
                "5": 56
            },
            {
                "1": 80,
                "2": 90,
                "3": 100,
                "4": 110,
                "5": 120
            },
            {
                "1": 30,
                "2": 35,
                "3": 40,
                "4": 45,
                "5": 50
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Engulfing_Lightning"
    },
    "EverlastingMoonglow": {
        "name": "Everlasting Moonglow",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Branch",
        "matStrongEnemy": "Mirror Maidens",
        "matWeakEnemy": "Specters",
        "baseATK": 46,
        "stat": "hp_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e1\/Weapon_Everlasting_Moonglow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/66\/Weapon_Everlasting_Moonglow_2nd.png"
        ],
        "passive": "Healing Bonus increased by @0%, Normal Attack DMG is increased by @1% of the Max HP of the character equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that hit opponents will restore 0.6 Energy. Energy can be restored this way once every 0.1s.",
        "refinementData": [
            {
                "1": 10,
                "2": 12.5,
                "3": 15,
                "4": 17.5,
                "5": 20
            },
            {
                "1": 1,
                "2": 1.5,
                "3": 2,
                "4": 2.5,
                "5": 3
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Everlasting_Moonglow"
    },
    "FreedomSworn": {
        "name": "Freedom-Sworn",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 46,
        "stat": "eleMas",
        "baseStat": 43,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/39\/Weapon_Freedom-Sworn.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e9\/Weapon_Freedom-Sworn_2nd.png"
        ],
        "passive": "A part of the \"Millennial Movement\" that wanders amidst the winds.\nIncreases DMG by @0%.\nWhen the character wielding this weapon triggers Elemental Reactions, they gain a Sigil of Rebellion. This effect can be triggered once every 0.5s and can be triggered even if said character is not on the field.\nWhen you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will obtain \"Millennial Movement: Song of Resistance\" for 12s.\n\"Millennial Movement: Song of Resistance\" increases Normal, Charged, and Plunging Attack DMG by @1% and increases ATK by @2%. Once this effect is triggered, you will not gain Sigils of Rebellion for 20s.\nOf the many effects of the \"Millennial Movement,\" buffs of the same type will not stack.",
        "refinementData": [
            {
                "1": 10,
                "2": 12.5,
                "3": 15,
                "4": 17.5,
                "5": 20
            },
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Freedom-Sworn"
    },
    "HaranGeppakuFutsu": {
        "name": "Haran Geppaku Futsu",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Claw",
        "matStrongEnemy": "Black Serpents",
        "matWeakEnemy": "Nobushi",
        "baseATK": 46,
        "stat": "critRate_",
        "baseStat": 7.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/85\/Weapon_Haran_Geppaku_Futsu.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/51\/Weapon_Haran_Geppaku_Futsu_2nd.png"
        ],
        "passive": "Obtain @0% All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the character equipping this weapon will gain 1 Wavespike stack. Max 2 stacks. This effect can be triggered once every 0.3s. When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to gain Rippling Upheaval: each stack of Wavespike consumed will increase Normal Attack DMG by @1% for 8s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Haran_Geppaku_Futsu"
    },
    "HuntersPath": {
        "name": "Hunter's Path",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Scarab",
        "matStrongEnemy": "Activated Fungi",
        "matWeakEnemy": "Eremites",
        "baseATK": 44,
        "stat": "critRate_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/dd\/Weapon_Hunter%27s_Path.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b5\/Weapon_Hunter%27s_Path_2nd.png"
        ],
        "passive": "Gain @0% All Elemental DMG Bonus. Obtain the Tireless Hunt effect after hitting an opponent with a Charged Attack. This effect increases Charged Attack DMG by @1% of Elemental Mastery. This effect will be removed after 12 Charged Attacks or 10s. Only 1 instance of Tireless Hunt can be gained every 12s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 160,
                "2": 200,
                "3": 240,
                "4": 280,
                "5": 320
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Hunter%27s_Path"
    },
    "JadefallsSplendor": {
        "name": "Jadefall's Splendor",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Guyun",
        "matStrongEnemy": "Hilichurl Rogues",
        "matWeakEnemy": "Fungi",
        "baseATK": 46,
        "stat": "hp_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/7a\/Weapon_Jadefall%27s_Splendor.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/83\/Weapon_Jadefall%27s_Splendor_2nd.png"
        ],
        "passive": "For 3s after using an Elemental Burst or creating a shield, the equipping character can gain the Primordial Jade Regalia effect: Restore @0 Energy every 2.5s, and gain @1% Elemental DMG Bonus for their corresponding Elemental Type for every 1,000 Max HP they possess, up to @2%. Primordial Jade Regalia will still take effect even if the equipping character is not on the field.",
        "refinementData": [
            {
                "1": 4.5,
                "2": 5,
                "3": 5.5,
                "4": 6,
                "5": 6.5
            },
            {
                "1": 0.3,
                "2": 0.5,
                "3": 0.7,
                "4": 0.9000000000000001,
                "5": 1.1
            },
            {
                "1": 12,
                "2": 20,
                "3": 28,
                "4": 36,
                "5": 44
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Jadefall%27s_Splendor"
    },
    "KagurasVerity": {
        "name": "Kagura's Verity",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Mask",
        "matStrongEnemy": "Riftwolves",
        "matWeakEnemy": "Specters",
        "baseATK": 46,
        "stat": "critDMG_",
        "baseStat": 14.4,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b7\/Weapon_Kagura%27s_Verity.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1a\/Weapon_Kagura%27s_Verity_2nd.png"
        ],
        "passive": "Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character wielding this weapon to increase by @0% for 16s. Max 3 stacks. This character will gain @1% All Elemental DMG Bonus when they possess 3 stacks.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Kagura%27s_Verity"
    },
    "KeyOfKhajNisut": {
        "name": "Key of Khaj-Nisut",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Talisman",
        "matStrongEnemy": "Primal Constructs",
        "matWeakEnemy": "Eremites",
        "baseATK": 44,
        "stat": "hp_",
        "baseStat": 14.4,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/52\/Weapon_Key_of_Khaj-Nisut.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ce\/Weapon_Key_of_Khaj-Nisut_2nd.png"
        ],
        "passive": "HP increased by @0%. When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the equipping character's Elemental Mastery by @1% of their Max HP. This effect can trigger once every 0.3s. Max 3 stacks. When this effect gains 3 stacks, or when the third stack's duration is refreshed, the Elemental Mastery of all nearby party members will be increased by @2% of the equipping character's max HP for 20s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 0.12,
                "2": 0.15,
                "3": 0.18,
                "4": 0.21,
                "5": 0.24
            },
            {
                "1": 0.2,
                "2": 0.25,
                "3": 0.30000000000000004,
                "4": 0.35000000000000003,
                "5": 0.4
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Key_of_Khaj-Nisut"
    },
    "LightOfFoliarIncision": {
        "name": "Light of Foliar Incision",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Talisman",
        "matStrongEnemy": "Consecrated Beasts",
        "matWeakEnemy": "Eremites",
        "baseATK": 44,
        "stat": "critDMG_",
        "baseStat": 19.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/de\/Weapon_Light_of_Foliar_Incision.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/30\/Weapon_Light_of_Foliar_Incision_2nd.png"
        ],
        "passive": "CRIT Rate is increased by @0%. After Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing DMG dealt by Normal Attacks and Elemental Skills by @1% of Elemental Mastery. This effect will disappear after 28 DMG instances or 12s. You can obtain Foliar Incision once every 12s.",
        "refinementData": [
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            },
            {
                "1": 120,
                "2": 150,
                "3": 180,
                "4": 210,
                "5": 240
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Light_of_Foliar_Incision"
    },
    "LostPrayerToTheSacredWinds": {
        "name": "Lost Prayer to the Sacred Winds",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Slimes",
        "baseATK": 46,
        "stat": "critRate_",
        "baseStat": 7.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/98\/Weapon_Lost_Prayer_to_the_Sacred_Winds.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/02\/Weapon_Lost_Prayer_to_the_Sacred_Winds_2nd.png"
        ],
        "passive": "Increases Movement SPD by 10%. When in battle, gain an @0% Elemental DMG Bonus every 4s. Max 4 stacks. Lasts until the character falls or leaves combat.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Lost_Prayer_to_the_Sacred_Winds"
    },
    "MemoryOfDust": {
        "name": "Memory of Dust",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 46,
        "stat": "atk_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ca\/Weapon_Memory_of_Dust.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fd\/Weapon_Memory_of_Dust_2nd.png"
        ],
        "passive": "Increases Shield Strength by @0%. Scoring hits on opponents increases ATK by @1% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Memory_of_Dust"
    },
    "MistsplitterReforged": {
        "name": "Mistsplitter Reforged",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Branch",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "Nobushi",
        "baseATK": 48,
        "stat": "critDMG_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/09\/Weapon_Mistsplitter_Reforged.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/df\/Weapon_Mistsplitter_Reforged_2nd.png"
        ],
        "passive": "Gain a @0% Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1\/2\/3, Mistsplitter's Emblem provides a @1\/@2\/@3% Elemental DMG Bonus for the character's Elemental Type. The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios: Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 28,
                "2": 35,
                "3": 42,
                "4": 49,
                "5": 56
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Mistsplitter_Reforged"
    },
    "PolarStar": {
        "name": "Polar Star",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Mask",
        "matStrongEnemy": "Riftwolves",
        "matWeakEnemy": "Specters",
        "baseATK": 46,
        "stat": "critRate_",
        "baseStat": 7.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/44\/Weapon_Polar_Star.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/09\/Weapon_Polar_Star_2nd.png"
        ],
        "passive": "Elemental Skill and Elemental Burst DMG increased by @0%. After a Normal Attack, Charged Attack, Elemental Skill or Elemental Burst hits an opponent, 1 stack of Ashen Nightstar will be gained for 12s. When 1\/2\/3\/4 stacks of Ashen Nightstar are present, ATK is increased by @1\/@2\/@3\/@4%. The stack of Ashen Nightstar created by the Normal Attack, Charged Attack, Elemental Skill or Elemental Burst will be counted independently of the others.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 10,
                "2": 12.5,
                "3": 15,
                "4": 17.5,
                "5": 20
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 30,
                "2": 37.5,
                "3": 45,
                "4": 52.5,
                "5": 60
            },
            {
                "1": 48,
                "2": 60,
                "3": 72,
                "4": 84,
                "5": 96
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Polar_Star"
    },
    "PrimordialJadeCutter": {
        "name": "Primordial Jade Cutter",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 44,
        "stat": "critRate_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2a\/Weapon_Primordial_Jade_Cutter.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b3\/Weapon_Primordial_Jade_Cutter_2nd.png"
        ],
        "passive": "HP increased by @0%. Additionally, provides an ATK Bonus based on @1% of the wielder's Max HP.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 1.2,
                "2": 1.5,
                "3": 1.7999999999999998,
                "4": 2.0999999999999996,
                "5": 2.4
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Primordial_Jade_Cutter"
    },
    "PrimordialJadeWingedSpear": {
        "name": "Primordial Jade Winged-Spear",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Fatui",
        "baseATK": 48,
        "stat": "critRate_",
        "baseStat": 4.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/80\/Weapon_Primordial_Jade_Winged-Spear.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/27\/Weapon_Primordial_Jade_Winged-Spear_2nd.png"
        ],
        "passive": "On hit, increases ATK by @0% for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by @1%.",
        "refinementData": [
            {
                "1": 3.2,
                "2": 3.9000000000000004,
                "3": 4.6,
                "4": 5.3,
                "5": 6
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Primordial_Jade_Winged-Spear"
    },
    "RedhornStonethresher": {
        "name": "Redhorn Stonethresher",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Claw",
        "matStrongEnemy": "Riftwolves",
        "matWeakEnemy": "Nobushi",
        "baseATK": 44,
        "stat": "critDMG_",
        "baseStat": 19.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d4\/Weapon_Redhorn_Stonethresher.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/18\/Weapon_Redhorn_Stonethresher_2nd.png"
        ],
        "passive": "DEF is increased by @0%. Normal and Charged Attack DMG is increased by @1% of DEF.",
        "refinementData": [
            {
                "1": 28,
                "2": 35,
                "3": 42,
                "4": 49,
                "5": 56
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Redhorn_Stonethresher"
    },
    "SkywardAtlas": {
        "name": "Skyward Atlas",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 48,
        "stat": "atk_",
        "baseStat": 7.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/33\/Weapon_Skyward_Atlas.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b1\/Weapon_Skyward_Atlas_2nd.png"
        ],
        "passive": "Increases Elemental DMG Bonus by @0%. Normal Attack hits have a 50% chance to earn the favor of the clouds. which actively seek out nearby opponents to attack for 15s, dealing @1% ATK DMG. Can only occur once every 30s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 160,
                "2": 200,
                "3": 240,
                "4": 280,
                "5": 320
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyward_Atlas"
    },
    "SkywardBlade": {
        "name": "Skyward Blade",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 46,
        "stat": "enerRech_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/03\/Weapon_Skyward_Blade.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/5d\/Weapon_Skyward_Blade_2nd.png"
        ],
        "passive": "CRIT Rate increased by @0%. Gains Skypiercing Might upon using an Elemental Burst: Increases Movement SPD by 10%, increases ATK SPD by 10%, and Normal and Charged hits deal additional DMG equal to @1% of ATK. Skypiercing Might lasts for 12s.",
        "refinementData": [
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyward_Blade"
    },
    "SkywardHarp": {
        "name": "Skyward Harp",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 48,
        "stat": "critRate_",
        "baseStat": 4.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/19\/Weapon_Skyward_Harp.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/60\/Weapon_Skyward_Harp_2nd.png"
        ],
        "passive": "Increases CRIT DMG by @0%. Hits have a @1% chance to inflict a small AoE attack, dealing 125% Physical ATK DMG. Can only occur once every @2s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 4,
                "2": 3.5,
                "3": 3,
                "4": 2.5,
                "5": 2
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyward_Harp"
    },
    "SkywardPride": {
        "name": "Skyward Pride",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 48,
        "stat": "enerRech_",
        "baseStat": 8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0b\/Weapon_Skyward_Pride.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/8e\/Weapon_Skyward_Pride_2nd.png"
        ],
        "passive": "Increases all DMG by @0%. After using an Elemental Burst, a vacuum blade that does @1% of ATK as DMG to opponents along its path will be created when Normal or Charged Attacks hit. Lasts for 20s or 8 vacuum blades.",
        "code": [
            [
                "stat",
                [
                    "dmg_",
                    "@0"
                ]
            ],
            [
                "addmv",
                [
                    "Normal Attack",
                    "Skyward Pride Vaccuum Blade (%)",
                    "@1"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 80,
                "2": 100,
                "3": 120,
                "4": 140,
                "5": 160
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyward_Pride"
    },
    "SkywardSpine": {
        "name": "Skyward Spine",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 48,
        "stat": "enerRech_",
        "baseStat": 8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/69\/Weapon_Skyward_Spine.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/7b\/Weapon_Skyward_Spine_2nd.png"
        ],
        "passive": "Increases CRIT Rate by @0% and increases Normal ATK SPD by 12%. Additionally, Normal and Charged Attacks hits on opponents have a 50% chance to trigger a vacuum blade that deals @1% of ATK as DMG in a small AoE. This effect can occur no more than once every 2s.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 40,
                "2": 55,
                "3": 70,
                "4": 85,
                "5": 100
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyward_Spine"
    },
    "SongOfBrokenPines": {
        "name": "Song of Broken Pines",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 49,
        "stat": "physical_dmg_",
        "baseStat": 4.5,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/dd\/Weapon_Song_of_Broken_Pines.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/55\/Weapon_Song_of_Broken_Pines_2nd.png"
        ],
        "passive": "A part of the \"Millennial Movement\" that wanders amidst the winds.\nIncreases ATK by @0%, and when Normal or Charged Attacks hit opponents, the character gains a Sigil of Whispers. This effect can be triggered once every 0.3s.\nWhen you possess four Sigils of Whispers, all of them will be consumed and all nearby party members will obtain the \"Millennial Movement: Banner-Hymn\" effect for 12s.\n\"Millennial Movement: Banner-Hymn\" increases Normal ATK SPD by @1% and increases ATK by @2%. Once this effect is triggered, you will not gain Sigils of Whispers for 20s.\nOf the many effects of the \"Millennial Movement\", buffs of the same type will not stack.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Song_of_Broken_Pines"
    },
    "SplendorOfTranquilWaters": {
        "name": "Splendor of Tranquil Waters",
        "type": "Sword",
        "rarity": 5,
        "baseATK": 44,
        "stat": "critDMG_",
        "passive": "When the equipping character's current HP increases or decreases, Elemental Skill DMG dealt will be increased by @0% for 6s. Max 3 stacks. This effect can be triggered once every 0.2s. When other party members' current HP increases or decreases, the equipping character's Max HP will be increased by @1% for 6s. Max 2 stacks. This effect can be triggered once every 0.2s. The aforementioned effects can be triggered even if the wielder is off-field.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 14,
                "2": 17.5,
                "3": 21,
                "4": 24.5,
                "5": 28
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Splendor_of_Tranquil_Waters",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4f\/Weapon_Splendor_of_Tranquil_Waters.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a0\/Weapon_Splendor_of_Tranquil_Waters_2nd.png"
        ],
        "matForgery": "Dewdrop",
        "matStrongEnemy": "Hydro Phantasms",
        "matWeakEnemy": "Fontemer"
    },
    "StaffOfHoma": {
        "name": "Staff of Homa",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Aeros",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 46,
        "stat": "critDMG_",
        "baseStat": 14.4,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/17\/Weapon_Staff_of_Homa.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ee\/Weapon_Staff_of_Homa_2nd.png"
        ],
        "passive": "HP increased by @0%. Additionally, provides an ATK Bonus based on @1% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional @2% of Max HP.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 0.8,
                "2": 1,
                "3": 1.2000000000000002,
                "4": 1.4000000000000001,
                "5": 1.6
            },
            {
                "1": 1,
                "2": 1.2,
                "3": 1.4,
                "4": 1.6,
                "5": 1.8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Staff_of_Homa"
    },
    "StaffOfTheScarletSands": {
        "name": "Staff of the Scarlet Sands",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Plate",
        "matStrongEnemy": "Ruin Drakes",
        "matWeakEnemy": "Fungi",
        "baseATK": 44,
        "stat": "critRate_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/44\/Weapon_Staff_of_the_Scarlet_Sands.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4d\/Weapon_Staff_of_the_Scarlet_Sands_2nd.png"
        ],
        "passive": "The equipping character gains @0% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be gained for 10s: The equipping character will gain @1% of their Elemental Mastery as bonus ATK. Max 3 stacks.",
        "refinementData": [
            {
                "1": 52,
                "2": 65,
                "3": 78,
                "4": 91,
                "5": 104
            },
            {
                "1": 28,
                "2": 35,
                "3": 42,
                "4": 49,
                "5": 56
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Staff_of_the_Scarlet_Sands"
    },
    "SummitShaper": {
        "name": "Summit Shaper",
        "rarity": 5,
        "type": "Sword",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 46,
        "stat": "atk_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ca\/Weapon_Summit_Shaper.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/24\/Weapon_Summit_Shaper_2nd.png"
        ],
        "passive": "Increases Shield Strength by @0%. Scoring hits on opponents increases ATK by @1% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Summit_Shaper"
    },
    "TheFirstGreatMagic": {
        "name": "The First Great Magic",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/03\/Weapon_The_First_Great_Magic.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/cc\/Weapon_The_First_Great_Magic_2nd.png"
        ],
        "rarity": 5,
        "type": "Bow",
        "passive": "DMG dealt by Charged Attacks increased by @0%. For every party member with the same Elemental Type as the wielder (including the wielder themselves), gain 1 Gimmick stack. For every party member with a different Elemental Type from the wielder, gain 1 Theatrics stack. When the wielder has 1\/2\/3 or more Gimmick stacks, ATK will be increased by @1%\/@2%\/@3%. When the wielder has 1\/2\/3 or more Theatrics stacks, Movement SPD will be increased by @4%\/@5%\/@6%.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 32,
                "2": 40,
                "3": 48,
                "4": 56,
                "5": 64
            },
            {
                "1": 48,
                "2": 60,
                "3": 72,
                "4": 84,
                "5": 96
            },
            {
                "1": 4,
                "2": 6,
                "3": 8,
                "4": 10,
                "5": 12
            },
            {
                "1": 7,
                "2": 9,
                "3": 11,
                "4": 13,
                "5": 15
            },
            {
                "1": 10,
                "2": 12,
                "3": 14,
                "4": 16,
                "5": 18
            }
        ],
        "matForgery": "Chord",
        "matStrongEnemy": "Hydro Phantasms",
        "matWeakEnemy": "Fontemer",
        "baseATK": 46,
        "stat": "critDMG_",
        "baseStat": 14.4,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_First_Great_Magic"
    },
    "TheUnforged": {
        "name": "The Unforged",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 46,
        "stat": "atk_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f7\/Weapon_The_Unforged.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/34\/Weapon_The_Unforged_2nd.png"
        ],
        "passive": "Increases Shield Strength by @0%. Scoring hits on opponents increases ATK by @1% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Unforged"
    },
    "ThunderingPulse": {
        "name": "Thundering Pulse",
        "rarity": 5,
        "type": "Bow",
        "matForgery": "Claw",
        "matStrongEnemy": "Mirror Maidens",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 46,
        "stat": "critDMG_",
        "baseStat": 14.4,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/77\/Weapon_Thundering_Pulse.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ee\/Weapon_Thundering_Pulse_2nd.png"
        ],
        "passive": "Increases ATK by @0% and grants the might of the Thunder Emblem. At stack levels 1\/2\/3, the Thunder Emblem increases Normal Attack DMG by @1\/@2\/@3%. The character will obtain 1 stack of Thunder Emblem in each of the following scenarios: Normal Attack deals DMG (stack lasts 5s), casting Elemental Skill (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Thundering_Pulse"
    },
    "TomeOfTheEternalFlow": {
        "name": "Tome of the Eternal Flow",
        "type": "Catalyst",
        "rarity": 5,
        "baseATK": 44,
        "stat": "critDMG_",
        "passive": "HP is increased by @0%. When current HP increases or decreases, Charged Attack DMG will be increased by @1% for 4s. Max 3 stacks, can be triggered once every 0.3s. When you have 3 stacks or refresh a third stack's duration, @2 Energy will be restored. This Energy restoration effect can be triggered once every 12s.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 14,
                "2": 18,
                "3": 22,
                "4": 26,
                "5": 30
            },
            {
                "1": 8,
                "2": 9,
                "3": 10,
                "4": 11,
                "5": 12
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Tome_of_the_Eternal_Flow",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/91\/Weapon_Tome_of_the_Eternal_Flow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/85\/Weapon_Tome_of_the_Eternal_Flow_2nd.png"
        ],
        "matForgery": "Dewdrop",
        "matStrongEnemy": "Breacher Primus",
        "matWeakEnemy": "Meka"
    },
    "TulaytullahsRemembrance": {
        "name": "Tulaytullah's Remembrance",
        "rarity": 5,
        "type": "Catalyst",
        "matForgery": "Scarab",
        "matStrongEnemy": "Activated Fungi",
        "matWeakEnemy": "Fungi",
        "baseATK": 48,
        "stat": "critDMG_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fc\/Weapon_Tulaytullah%27s_Remembrance.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0b\/Weapon_Tulaytullah%27s_Remembrance_2nd.png"
        ],
        "passive": "Normal Attack SPD is increased by @0%. After the wielder unleashes an Elemental Skill, Normal Attack DMG will increase by @1% every second for 14s. After this character hits an opponent with a Normal Attack during this duration, Normal Attack DMG will be increased by @2%. This increase can be triggered once every 0.3s. The maximum Normal Attack DMG increase per single duration of the overall effect is @3%. The effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset all DMG buffs.",
        "refinementData": [
            {
                "1": 10,
                "2": 12.5,
                "3": 15,
                "4": 17.5,
                "5": 20
            },
            {
                "1": 4.8,
                "2": 6,
                "3": 7.199999999999999,
                "4": 8.399999999999999,
                "5": 9.6
            },
            {
                "1": 9.6,
                "2": 12,
                "3": 14.399999999999999,
                "4": 16.799999999999997,
                "5": 19.2
            },
            {
                "1": 48,
                "2": 60,
                "3": 72,
                "4": 84,
                "5": 96
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Tulaytullah%27s_Remembrance"
    },
    "UrakuMisugiri": {
        "name": "Uraku Misugiri",
        "type": "Sword",
        "rarity": 5,
        "baseATK": 44,
        "stat": "critDMG_",
        "passive": "Normal Attack DMG is increased by @0% and Elemental Skill DMG is increased by @1%. After a nearby active character deals Geo DMG, the aforementioned effects increase by 100% for 15s. Additionally, the wielder's DEF is increased by @2%.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Uraku_Misugiri",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/44\/Weapon_Uraku_Misugiri.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ca\/Weapon_Uraku_Misugiri_2nd.png"
        ],
        "matForgery": "Branch",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "Nobushi"
    },
    "Verdict": {
        "name": "Verdict",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Chord",
        "matStrongEnemy": "Breacher Primuses",
        "matWeakEnemy": "Meka",
        "baseATK": 48,
        "stat": "critRate_",
        "baseStat": 4.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1d\/Weapon_Verdict.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ef\/Weapon_Verdict_2nd.png"
        ],
        "passive": "Increases ATK by @0%. When characters in your party obtain Elemental Shards from Crystallize reactions, the equipping character will gain 1 Seal, increasing Elemental Skill DMG by @1%. The Seal lasts for 15s, and the equipped may have up to 2 Seals at once. All of the equipper's Seals will disappear 0.2s after their Elemental Skill deals DMG.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 18,
                "2": 22.5,
                "3": 27,
                "4": 31.5,
                "5": 36
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Verdict"
    },
    "VortexVanquisher": {
        "name": "Vortex Vanquisher",
        "rarity": 5,
        "type": "Polearm",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 46,
        "stat": "atk_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d6\/Weapon_Vortex_Vanquisher.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ca\/Weapon_Vortex_Vanquisher_2nd.png"
        ],
        "passive": "Increases Shield Strength by @0%. Scoring hits on opponents increases ATK by @1% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Vortex_Vanquisher"
    },
    "WolfsGravestone": {
        "name": "Wolf's Gravestone",
        "rarity": 5,
        "type": "Claymore",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 46,
        "stat": "atk_",
        "baseStat": 10.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4f\/Weapon_Wolf%27s_Gravestone.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0e\/Weapon_Wolf%27s_Gravestone_2nd.png"
        ],
        "passive": "Increases ATK by @0%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by @1% for 12s. Can only occur once every 30s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Wolf%27s_Gravestone"
    },
    "TheCatch": {
        "name": "\"The Catch\"",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Mask",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "Specters",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f5\/Weapon_The_Catch.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/45\/Weapon_The_Catch_2nd.png"
        ],
        "passive": "Increases Elemental Burst DMG by @0% and Elemental Burst CRIT Rate by @1%.",
        "code": [
            [
                "stat",
                [
                    "burst_dmg_",
                    "@0"
                ]
            ],
            [
                "sstat",
                [
                    "critRate_",
                    "@1",
                    "Elemental Burst"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/%22The_Catch%22"
    },
    "UltimateOverlordsMegaMagicSword": {
        "name": "\"Ultimate Overlord's Mega Magic Sword\"",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Chalice",
        "matStrongEnemy": "Fatui Operatives",
        "matWeakEnemy": "Meka",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6e\/Weapon_Ultimate_Overlord's_Mega_Magic_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/48\/Weapon_Ultimate_Overlord's_Mega_Magic_Sword_2nd.png"
        ],
        "passive": "ATK increased by @0%. That's not all! The support from all Melusines you've helped in Merusea Village fills you with strength! Based on the number of them you've helped, your ATK is increased by up to an additional @1%.",
        "code": [
            [
                "stat",
                [
                    "atk_",
                    "@0"
                ]
            ],
            [
                "stat",
                [
                    "atk_",
                    "@1"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/%22Ultimate_Overlord%27s_Mega_Magic_Sword%22"
    },
    "Akuoumaru": {
        "name": "Akuoumaru",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Branch",
        "matStrongEnemy": "Riftwolves",
        "matWeakEnemy": "Nobushi",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c5\/Weapon_Akuoumaru.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/45\/Weapon_Akuoumaru_2nd.png"
        ],
        "passive": "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by @0%. A maximum of @1% increased Elemental Burst DMG can be achieved this way.",
        "refinementData": [
            {
                "1": 0.12,
                "2": 0.15,
                "3": 0.18,
                "4": 0.21,
                "5": 0.24
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Akuoumaru"
    },
    "AlleyHunter": {
        "name": "Alley Hunter",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0a\/Weapon_Alley_Hunter.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/16\/Weapon_Alley_Hunter_2nd.png"
        ],
        "passive": "While the character equipped with this weapon is in the party but not on the field, their DMG increases by @0% every second up to a max of @1%. When the character is on the field for more than 4s, the aforementioned DMG buff decreases by @2% per second until it reaches 0%.",
        "refinementData": [
            {
                "1": 2,
                "2": 2.5,
                "3": 3,
                "4": 3.5,
                "5": 4
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Alley_Hunter"
    },
    "AmenomaKageuchi": {
        "name": "Amenoma Kageuchi",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Branch",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "Nobushi",
        "baseATK": 41,
        "stat": "atk_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ea\/Weapon_Amenoma_Kageuchi.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c0\/Weapon_Amenoma_Kageuchi_2nd.png"
        ],
        "passive": "After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered once every 5s. The Succession Seed lasts for 30s. Up to 3 Succession Seeds may exist simultaneously. After using an Elemental Burst, all Succession Seeds are consumed and after 2s, the character regenerates @0 Energy for each seed consumed.",
        "refinementData": [
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Amenoma_Kageuchi"
    },
    "BalladOfTheBoundlessBlue": {
        "name": "Ballad of the Boundless Blue",
        "type": "Catalyst",
        "rarity": 4,
        "baseATK": 44,
        "stat": "enerRech_",
        "passive": "Within 6s after Normal or Charged Attacks hit an opponent, Normal Attack DMG will be increased by @0% and Charged Attack DMG will be increased by @1%. Max 3 stacks. This effect can be triggered once every 0.3s.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Ballad_of_the_Boundless_Blue",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b5\/Weapon_Ballad_of_the_Boundless_Blue.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1d\/Weapon_Ballad_of_the_Boundless_Blue_2nd.png"
        ],
        "matForgery": "Tooth",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "T.Hoarders"
    },
    "BalladOfTheFjords": {
        "name": "Ballad of the Fjords",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/82\/Weapon_Ballad_of_the_Fjords.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/be\/Weapon_Ballad_of_the_Fjords_2nd.png"
        ],
        "rarity": 4,
        "type": "Polearm",
        "passive": "When there are at least 3 different Elemental Types in your party, Elemental Mastery will be increased by @0.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "eleMas",
                    "@0"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 120,
                "2": 150,
                "3": 180,
                "4": 210,
                "5": 240
            }
        ],
        "matForgery": "Chalice",
        "matStrongEnemy": "Hilichurl Rogues",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "critRate_",
        "baseStat": 6,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Ballad_of_the_Fjords"
    },
    "BlackcliffAgate": {
        "name": "Blackcliff Agate",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Samachurls",
        "baseATK": 42,
        "stat": "critDMG_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a6\/Weapon_Blackcliff_Agate.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/50\/Weapon_Blackcliff_Agate_2nd.png"
        ],
        "passive": "After defeating an opponent, ATK is increased by @0% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Blackcliff_Agate"
    },
    "BlackcliffLongsword": {
        "name": "Blackcliff Longsword",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 44,
        "stat": "critDMG_",
        "baseStat": 8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6f\/Weapon_Blackcliff_Longsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/15\/Weapon_Blackcliff_Longsword_2nd.png"
        ],
        "passive": "After defeating an opponent, ATK is increased by @0% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Blackcliff_Longsword"
    },
    "BlackcliffPole": {
        "name": "Blackcliff Pole",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Fatui",
        "baseATK": 42,
        "stat": "critDMG_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d5\/Weapon_Blackcliff_Pole.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/45\/Weapon_Blackcliff_Pole_2nd.png"
        ],
        "passive": "After defeating an opponent, ATK is increased by @0% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Blackcliff_Pole"
    },
    "BlackcliffSlasher": {
        "name": "Blackcliff Slasher",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Fatui",
        "baseATK": 42,
        "stat": "critDMG_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d7\/Weapon_Blackcliff_Slasher.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/de\/Weapon_Blackcliff_Slasher_2nd.png"
        ],
        "passive": "After defeating an opponent, ATK is increased by @0% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Blackcliff_Slasher"
    },
    "BlackcliffWarbow": {
        "name": "Blackcliff Warbow",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 44,
        "stat": "critDMG_",
        "baseStat": 8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b8\/Weapon_Blackcliff_Warbow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/17\/Weapon_Blackcliff_Warbow_2nd.png"
        ],
        "passive": "After defeating an opponent, ATK is increased by @0% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Blackcliff_Warbow"
    },
    "CinnabarSpindle": {
        "name": "Cinnabar Spindle",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 41,
        "stat": "def_",
        "baseStat": 15,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/dc\/Weapon_Cinnabar_Spindle.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4a\/Weapon_Cinnabar_Spindle_2nd.png"
        ],
        "passive": "Elemental Skill DMG is increased by @0% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Cinnabar_Spindle"
    },
    "CompoundBow": {
        "name": "Compound Bow",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Fatui",
        "baseATK": 41,
        "stat": "physical_dmg_",
        "baseStat": 15,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/32\/Weapon_Compound_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/3b\/Weapon_Compound_Bow_2nd.png"
        ],
        "passive": "Normal Attack and Charged Attack hits increase ATK by @0% and Normal ATK SPD by @1% for 6s. Max 4 stacks. Can only occur once every 0.3s.",
        "refinementData": [
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            },
            {
                "1": 1.2,
                "2": 1.5,
                "3": 1.7999999999999998,
                "4": 2.0999999999999996,
                "5": 2.4
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Compound_Bow"
    },
    "CrescentPike": {
        "name": "Crescent Pike",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 44,
        "stat": "physical_dmg_",
        "baseStat": 7.5,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4c\/Weapon_Crescent_Pike.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/04\/Weapon_Crescent_Pike_2nd.png"
        ],
        "passive": "After picking up an Elemental Orb\/Particle, Normal and Charged Attacks deal an additional @0% ATK as DMG for 5s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Crescent_Pike"
    },
    "Deathmatch": {
        "name": "Deathmatch",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 41,
        "stat": "critRate_",
        "baseStat": 8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/69\/Weapon_Deathmatch.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/df\/Weapon_Deathmatch_2nd.png"
        ],
        "passive": "If there are at least 2 opponents nearby, ATK is increased by @0% and DEF is increased by @1%. If there are fewer than 2 opponents nearby, ATK is increased by @2%.",
        "code": [
            [
                "proc",
                [
                    [
                        "stat",
                        [
                            "atk_",
                            "@0"
                        ]
                    ],
                    [
                        "stat",
                        [
                            "def_",
                            "@1"
                        ]
                    ]
                ]
            ],
            [
                "proc",
                [
                    "stat",
                    [
                        "atk_",
                        "@2"
                    ]
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Deathmatch"
    },
    "DialoguesOfTheDesertSages": {
        "name": "Dialogues of the Desert Sages",
        "type": "Polearm",
        "rarity": 4,
        "baseATK": 42,
        "stat": "hp_",
        "passive": "When the wielder performs healing, restore @0 Energy. This effect can be triggered once every 10s and can occur even when the character is not on the field.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Dialogues_of_the_Desert_Sages",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ea\/Weapon_Dialogues_of_the_Desert_Sages.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ab\/Weapon_Dialogues_of_the_Desert_Sages_2nd.png"
        ],
        "matForgery": "Talisman",
        "matStrongEnemy": "Xuanwen Beasts",
        "matWeakEnemy": "Specters"
    },
    "DodocoTales": {
        "name": "Dodoco Tales",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 41,
        "stat": "atk_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/51\/Weapon_Dodoco_Tales.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e9\/Weapon_Dodoco_Tales_2nd.png"
        ],
        "passive": "Normal Attack hits on opponents increase Charged Attack DMG by @0% for 6s. Charged Attack hits on opponents increase ATK by @1% for 6s.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Dodoco_Tales"
    },
    "DragonsBane": {
        "name": "Dragon's Bane",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Samachurls",
        "baseATK": 41,
        "stat": "eleMas",
        "baseStat": 48,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/24\/Weapon_Dragon%27s_Bane.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/04\/Weapon_Dragon%27s_Bane_2nd.png"
        ],
        "passive": "Increases DMG against opponents affected by Hydro or Pyro by @0%.",
        "refinementData": [
            {
                "1": 20,
                "2": 24,
                "3": 28,
                "4": 32,
                "5": 36
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Dragon%27s_Bane"
    },
    "DragonspineSpear": {
        "name": "Dragonspine Spear",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Tooth",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Fatui",
        "baseATK": 41,
        "stat": "physical_dmg_",
        "baseStat": 15,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1a\/Weapon_Dragonspine_Spear.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fb\/Weapon_Dragonspine_Spear_2nd.png"
        ],
        "passive": "Hitting an opponent with Normal and Charged Attacks has a @0% chance of forming and dropping an Everfrost Icicle above them, dealing @1% AoE ATK DMG. Opponents affected by Cryo are dealt @2% ATK DMG instead by the icicle. Can only occur once every 10s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 80,
                "2": 95,
                "3": 110,
                "4": 125,
                "5": 140
            },
            {
                "1": 200,
                "2": 240,
                "3": 280,
                "4": 320,
                "5": 360
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Dragonspine_Spear"
    },
    "EndOfTheLine": {
        "name": "End of the Line",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Scarab",
        "matStrongEnemy": "Activated Fungi",
        "matWeakEnemy": "Fungi",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/71\/Weapon_End_of_the_Line.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/04\/Weapon_End_of_the_Line_2nd.png"
        ],
        "passive": "Triggers the Flowrider effect after using an Elemental Skill, dealing @0% ATK as AoE DMG upon hitting an opponent with an attack. Flowrider will be removed after 15s or after causing 3 instances of AoE DMG. Only 1 instance of AoE DMG can be caused every 2s in this way. Flowrider can be triggered once every 12s.",
        "refinementData": [
            {
                "1": 80,
                "2": 100,
                "3": 120,
                "4": 140,
                "5": 160
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/End_of_the_Line"
    },
    "EyeOfPerception": {
        "name": "Eye of Perception",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 41,
        "stat": "atk_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6c\/Weapon_Eye_of_Perception.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f3\/Weapon_Eye_of_Perception_2nd.png"
        ],
        "passive": "Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing @0% ATK as DMG. This bolt can bounce between opponents a maximum of 4 times. This effect can occur once every @1s.",
        "refinementData": [
            {
                "1": 240,
                "2": 270,
                "3": 300,
                "4": 330,
                "5": 360
            },
            {
                "1": 12,
                "2": 11,
                "3": 10,
                "4": 9,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Eye_of_Perception"
    },
    "FadingTwilight": {
        "name": "Fading Twilight",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Aeros",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Samachurls",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2b\/Weapon_Fading_Twilight.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6d\/Weapon_Fading_Twilight_2nd.png"
        ],
        "passive": "Has three states, Evengleam, Afterglow, and Dawnblaze, which increase DMG dealt by @0%\/@1%\/@2% respectively. When attacks hit opponents, this weapon will switch to the next state. This weapon can change states once every 7s. The character equipping this weapon can still trigger the state switch while not on the field.",
        "refinementData": [
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            },
            {
                "1": 10,
                "2": 12.5,
                "3": 15,
                "4": 17.5,
                "5": 20
            },
            {
                "1": 14,
                "2": 17.5,
                "3": 21,
                "4": 24.5,
                "5": 28
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Fading_Twilight"
    },
    "FavoniusCodex": {
        "name": "Favonius Codex",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Samachurls",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/36\/Weapon_Favonius_Codex.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2b\/Weapon_Favonius_Codex_2nd.png"
        ],
        "passive": "CRIT hits have a @0% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 12,
                "2": 10.5,
                "3": 9,
                "4": 7.5,
                "5": 6
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Favonius_Codex"
    },
    "FavoniusGreatsword": {
        "name": "Favonius Greatsword",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Fatui",
        "baseATK": 41,
        "stat": "enerRech_",
        "baseStat": 13.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9c\/Weapon_Favonius_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/01\/Weapon_Favonius_Greatsword_2nd.png"
        ],
        "passive": "CRIT hits have a @0% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 12,
                "2": 10.5,
                "3": 9,
                "4": 7.5,
                "5": 6
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Favonius_Greatsword"
    },
    "FavoniusLance": {
        "name": "Favonius Lance",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/57\/Weapon_Favonius_Lance.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e3\/Weapon_Favonius_Lance_2nd.png"
        ],
        "passive": "CRIT Hits have a @0% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 12,
                "2": 10.5,
                "3": 9,
                "4": 7.5,
                "5": 6
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Favonius_Lance"
    },
    "FavoniusSword": {
        "name": "Favonius Sword",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 41,
        "stat": "enerRech_",
        "baseStat": 13.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/90\/Weapon_Favonius_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c6\/Weapon_Favonius_Sword_2nd.png"
        ],
        "passive": "CRIT hits have a @0% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 12,
                "2": 10.5,
                "3": 9,
                "4": 7.5,
                "5": 6
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Favonius_Sword"
    },
    "FavoniusWarbow": {
        "name": "Favonius Warbow",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 41,
        "stat": "enerRech_",
        "baseStat": 13.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/85\/Weapon_Favonius_Warbow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/92\/Weapon_Favonius_Warbow_2nd.png"
        ],
        "passive": "CRIT hits have a @0% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 12,
                "2": 10.5,
                "3": 9,
                "4": 7.5,
                "5": 6
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Favonius_Warbow"
    },
    "FesteringDesire": {
        "name": "Festering Desire",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Fatui",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/70\/Weapon_Festering_Desire.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a8\/Weapon_Festering_Desire_2nd.png"
        ],
        "passive": "Increases Elemental Skill DMG by @0% and Elemental Skill CRIT Rate by @1%.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Festering_Desire"
    },
    "FinaleOfTheDeep": {
        "name": "Finale of the Deep",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/5a\/Weapon_Finale_of_the_Deep.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ad\/Weapon_Finale_of_the_Deep_2nd.png"
        ],
        "rarity": 4,
        "type": "Sword",
        "passive": "When using an Elemental Skill, ATK will be increased by @0% for 15s, and a Bond of Life worth 25% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of Life is cleared, a maximum of @1 ATK will be gained based on @2% of the total amount of the Life Bond cleared, lasting for 15s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 150,
                "2": 187.5,
                "3": 225,
                "4": 262.5,
                "5": 300
            },
            {
                "1": 2.4,
                "2": 3,
                "3": 3.5999999999999996,
                "4": 4.199999999999999,
                "5": 4.8
            }
        ],
        "matForgery": "Dewdrop",
        "matStrongEnemy": "Hydro Phantasms",
        "matWeakEnemy": "Nobushi",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Finale_of_the_Deep"
    },
    "FleuveCendreFerryman": {
        "name": "Fleuve Cendre Ferryman",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/7e\/Weapon_Fleuve_Cendre_Ferryman.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6f\/Weapon_Fleuve_Cendre_Ferryman_2nd.png"
        ],
        "rarity": 4,
        "type": "Sword",
        "passive": "Increases Elemental Skill CRIT Rate by @0%. Additionally, increases Energy Recharge by @1% for 5s after using an Elemental Skill.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            }
        ],
        "matForgery": "Chord",
        "matStrongEnemy": "Hydro Phantasms",
        "matWeakEnemy": "Fontemer",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Fleuve_Cendre_Ferryman"
    },
    "FlowingPurity": {
        "name": "Flowing Purity",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/01\/Weapon_Flowing_Purity.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/be\/Weapon_Flowing_Purity_2nd.png"
        ],
        "rarity": 4,
        "type": "Catalyst",
        "passive": "When using an Elemental Skill, All Elemental DMG Bonus will be increased by @0% for 15s, and a Bond of Life worth 24% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond Of Life is cleared, every 1,000 HP cleared in the process will provide @1% All Elemental DMG Bonus, up to a maximum of @2%. This effect lasts 15s.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            },
            {
                "1": 2,
                "2": 2.5,
                "3": 3,
                "4": 3.5,
                "5": 4
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "matForgery": "Dewdrop",
        "matStrongEnemy": "Breacher Primuses",
        "matWeakEnemy": "Fontemer",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Flowing_Purity"
    },
    "ForestRegalia": {
        "name": "Forest Regalia",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Talisman",
        "matStrongEnemy": "Ruin Drakes",
        "matWeakEnemy": "Eremites",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/51\/Weapon_Forest_Regalia.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b8\/Weapon_Forest_Regalia_2nd.png"
        ],
        "passive": "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character @0 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.",
        "refinementData": [
            {
                "1": 60,
                "2": 75,
                "3": 90,
                "4": 105,
                "5": 120
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Forest_Regalia"
    },
    "Frostbearer": {
        "name": "Frostbearer",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1c\/Weapon_Frostbearer.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/bb\/Weapon_Frostbearer_2nd.png"
        ],
        "passive": "Hitting an opponent with Normal and Charged Attacks has a @0% chance of forming and dropping an Everfrost Icicle above them, dealing @1% AoE ATK DMG. Opponents affected by Cryo are dealt @2% ATK DMG instead by the icicle. Can only occur once every 10s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 80,
                "2": 95,
                "3": 110,
                "4": 125,
                "5": 140
            },
            {
                "1": 200,
                "2": 240,
                "3": 280,
                "4": 320,
                "5": 360
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Frostbearer"
    },
    "FruitOfFulfillment": {
        "name": "Fruit of Fulfillment",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Plate",
        "matStrongEnemy": "Black Serpents",
        "matWeakEnemy": "Fungi",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/98\/Weapon_Fruit_of_Fulfillment.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/10\/Weapon_Fruit_of_Fulfillment_2nd.png"
        ],
        "passive": "Obtain the \"Wax and Wane\" effect after an Elemental Reaction is triggered, gaining @0 Elemental Mastery while losing 5% ATK. For every 0.3s, 1 stack of Wax and Wane can be gained. Max 5 stacks. For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be lost. This effect can be triggered even when the character is off-field.",
        "refinementData": [
            {
                "1": 24,
                "2": 27,
                "3": 30,
                "4": 33,
                "5": 36
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Fruit_of_Fulfillment"
    },
    "HakushinRing": {
        "name": "Hakushin Ring",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Branch",
        "matStrongEnemy": "Mirror Maidens",
        "matWeakEnemy": "Samachurls",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ee\/Weapon_Hakushin_Ring.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6f\/Weapon_Hakushin_Ring_2nd.png"
        ],
        "passive": "After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members of an Elemental Type involved in the elemental reaction receive a @0% Elemental DMG Bonus for their element, lasting 6s. Elemental Bonuses gained in this way cannot be stacked.",
        "code": [
            "proc",
            [
                "stat",
                [
                    [
                        "anemo_dmg_",
                        "cryo_dmg_",
                        "dendro_dmg_",
                        "geo_dmg_",
                        "hydro_dmg_",
                        "electro_dmg_",
                        "pyro_dmg_"
                    ],
                    "@0"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 10,
                "2": 12.5,
                "3": 15,
                "4": 17.5,
                "5": 20
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Hakushin_Ring"
    },
    "Hamayumi": {
        "name": "Hamayumi",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Claw",
        "matStrongEnemy": "Mirror Maidens",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 41,
        "stat": "atk_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d9\/Weapon_Hamayumi.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e0\/Weapon_Hamayumi_2nd.png"
        ],
        "passive": "Increases Normal Attack DMG by @0% and Charged Attack DMG by @1%. When the equipping character's Energy reaches 100%, this effect is increased by 100%.",
        "code": [
            [
                "stat",
                [
                    "normal_dmg_",
                    "@0"
                ]
            ],
            [
                "stat",
                [
                    "charged_dmg_",
                    "@1"
                ]
            ],
            [
                "proc",
                [
                    [
                        "stat",
                        [
                            "normal_dmg_",
                            "@0"
                        ]
                    ],
                    [
                        "stat",
                        [
                            "charged_dmg_",
                            "@1"
                        ]
                    ]
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Hamayumi"
    },
    "IbisPiercer": {
        "name": "Ibis Piercer",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Talisman",
        "matStrongEnemy": "Hilichurl Rogues",
        "matWeakEnemy": "Eremites",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ce\/Weapon_Ibis_Piercer.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/cb\/Weapon_Ibis_Piercer_2nd.png"
        ],
        "passive": "The character's Elemental Mastery will increase by @0 within 6s after Charged Attacks hit opponents. Max 2 stacks. This effect can triggered once every 0.5s.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "eleMas",
                    "@0"
                ]
            ],
            2
        ],
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Ibis_Piercer"
    },
    "IronSting": {
        "name": "Iron Sting",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/35\/Weapon_Iron_Sting.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ac\/Weapon_Iron_Sting_2nd.png"
        ],
        "passive": "Dealing Elemental DMG increases all DMG by @0% for 6s. Max 2 stacks. Can only occur once every 1s.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "dmg_",
                    "@0"
                ]
            ],
            2
        ],
        "refinementData": [
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Iron_Sting"
    },
    "KagotsurubeIsshin": {
        "name": "Kagotsurube Isshin",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Mask",
        "matStrongEnemy": "Black Serpents",
        "matWeakEnemy": "Specters",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/96\/Weapon_Kagotsurube_Isshin.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/07\/Weapon_Kagotsurube_Isshin_2nd.png"
        ],
        "passive": "When a Normal, Charged, or Plunging Attack hits an opponent, it will whip up a Hewing Gale, dealing AoE DMG equal to 180% of ATK and increasing ATK by 15% for 8s. This effect can be triggered once every 8s.",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Kagotsurube_Isshin"
    },
    "KatsuragikiriNagamasa": {
        "name": "Katsuragikiri Nagamasa",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Claw",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "Nobushi",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2e\/Weapon_Katsuragikiri_Nagamasa.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/27\/Weapon_Katsuragikiri_Nagamasa_2nd.png"
        ],
        "passive": "Increases Elemental Skill DMG by @0%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates @1 Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.",
        "refinementData": [
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            },
            {
                "1": 3,
                "2": 3.5,
                "3": 4,
                "4": 4.5,
                "5": 5
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Katsuragikiri_Nagamasa"
    },
    "KingsSquire": {
        "name": "King's Squire",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Scarab",
        "matStrongEnemy": "Activated Fungi",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 41,
        "stat": "atk_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a2\/Weapon_King%27s_Squire.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b8\/Weapon_King%27s_Squire_2nd.png"
        ],
        "passive": "Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing Elemental Mastery by @0 for 12s. This effect will be removed when switching characters. When the Teachings of the Forest effect ends or is removed, it will deal @1% of ATK as DMG to 1 nearby opponent. The Teachings of the Forest effect can be triggered once every 20s.",
        "refinementData": [
            {
                "1": 60,
                "2": 80,
                "3": 100,
                "4": 120,
                "5": 140
            },
            {
                "1": 100,
                "2": 120,
                "3": 140,
                "4": 160,
                "5": 180
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/King%27s_Squire"
    },
    "KitainCrossSpear": {
        "name": "Kitain Cross Spear",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Mask",
        "matStrongEnemy": "Ruin Sentinels",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 44,
        "stat": "eleMas",
        "baseStat": 24,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/13\/Weapon_Kitain_Cross_Spear.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/5d\/Weapon_Kitain_Cross_Spear_2nd.png"
        ],
        "passive": "Increases Elemental Skill DMG by @0%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates @1 Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.",
        "code": [
            "stat",
            [
                "skill_dmg_",
                "@0"
            ]
        ],
        "refinementData": [
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            },
            {
                "1": 3,
                "2": 3.5,
                "3": 4,
                "4": 4.5,
                "5": 5
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Kitain_Cross_Spear"
    },
    "LionsRoar": {
        "name": "Lion's Roar",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e6\/Weapon_Lion%27s_Roar.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/09\/Weapon_Lion%27s_Roar_2nd.png"
        ],
        "passive": "Increases DMG against enemies affected by Pyro or Electro by @0%.",
        "refinementData": [
            {
                "1": 20,
                "2": 24,
                "3": 28,
                "4": 32,
                "5": 36
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Lion%27s_Roar"
    },
    "LithicBlade": {
        "name": "Lithic Blade",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/3a\/Weapon_Lithic_Blade.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d7\/Weapon_Lithic_Blade_2nd.png"
        ],
        "passive": "For every character in the party who hails from Liyue, the character who equips this weapon gains @0% ATK increase and @1% CRIT Rate increase. This effect stacks up to 4 times.",
        "refinementData": [
            {
                "1": 7,
                "2": 8,
                "3": 9,
                "4": 10,
                "5": 11
            },
            {
                "1": 3,
                "2": 4,
                "3": 5,
                "4": 6,
                "5": 7
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Lithic_Blade"
    },
    "LithicSpear": {
        "name": "Lithic Spear",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2a\/Weapon_Lithic_Spear.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c6\/Weapon_Lithic_Spear_2nd.png"
        ],
        "passive": "For every character in the party who hails from Liyue, the character who equips this weapon gains @0% ATK increase and a @1% CRIT Rate increase. This effect stacks up to 4 times.",
        "refinementData": [
            {
                "1": 7,
                "2": 8,
                "3": 9,
                "4": 10,
                "5": 11
            },
            {
                "1": 3,
                "2": 4,
                "3": 5,
                "4": 6,
                "5": 7
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Lithic_Spear"
    },
    "LuxuriousSeaLord": {
        "name": "Luxurious Sea-Lord",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Slimes",
        "baseATK": 41,
        "stat": "atk_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ab\/Weapon_Luxurious_Sea-Lord.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9f\/Weapon_Luxurious_Sea-Lord_2nd.png"
        ],
        "passive": "Increases Elemental Burst DMG by @0%. When Elemental Burst hits opponents, there is a 100% chance of summoning a huge onrush of tuna that deals @1% ATK as AoE DMG. This effect can occur once every 15s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 100,
                "2": 125,
                "3": 150,
                "4": 175,
                "5": 200
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Luxurious_Sea-Lord"
    },
    "MailedFlower": {
        "name": "Mailed Flower",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Consecrated Beasts",
        "matWeakEnemy": "Specters",
        "baseATK": 44,
        "stat": "eleMas",
        "baseStat": 24,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c7\/Weapon_Mailed_Flower.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2a\/Weapon_Mailed_Flower_2nd.png"
        ],
        "passive": "Within 8s after the character's Elemental Skill hits an opponent or the character triggers an Elemental Reaction, their ATK and Elemental Mastery will be increased by @0% and @1 respectively.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 48,
                "2": 60,
                "3": 72,
                "4": 84,
                "5": 96
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Mailed_Flower"
    },
    "MakhairaAquamarine": {
        "name": "Makhaira Aquamarine",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Scarab",
        "matStrongEnemy": "Ruin Drakes",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/90\/Weapon_Makhaira_Aquamarine.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ad\/Weapon_Makhaira_Aquamarine_2nd.png"
        ],
        "passive": "The following effect will trigger every 10s: The equipping character will gain @0% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Makhaira_Aquamarine"
    },
    "MappaMare": {
        "name": "Mappa Mare",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "eleMas",
        "baseStat": 24,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4d\/Weapon_Mappa_Mare.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ce\/Weapon_Mappa_Mare_2nd.png"
        ],
        "passive": "Triggering an Elemental reaction grants a @0% Elemental DMG Bonus for 10s. Max 2 stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Mappa_Mare"
    },
    "MissiveWindspear": {
        "name": "Missive Windspear",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Tooth",
        "matStrongEnemy": "Black Serpents",
        "matWeakEnemy": "Slimes",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9b\/Weapon_Missive_Windspear.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e9\/Weapon_Missive_Windspear_2nd.png"
        ],
        "passive": "Within 10s after an Elemental Reaction is triggered, ATK is increased by @0% and Elemental Mastery is increased by @1.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            },
            {
                "1": 48,
                "2": 60,
                "3": 72,
                "4": 84,
                "5": 96
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Missive_Windspear"
    },
    "MitternachtsWaltz": {
        "name": "Mitternachts Waltz",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 42,
        "stat": "physical_dmg_",
        "baseStat": 11.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/77\/Weapon_Mitternachts_Waltz.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ac\/Weapon_Mitternachts_Waltz_2nd.png"
        ],
        "passive": "Normal Attack hits on opponents increase Elemental Skill DMG by @0% for 5s. Elemental Skill hits on opponents increase Normal Attack DMG by @1% for 5s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Mitternachts_Waltz"
    },
    "Moonpiercer": {
        "name": "Moonpiercer",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Plate",
        "matStrongEnemy": "Ruin Drakes",
        "matWeakEnemy": "Fatui",
        "baseATK": 44,
        "stat": "eleMas",
        "baseStat": 24,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a4\/Weapon_Moonpiercer.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ab\/Weapon_Moonpiercer_2nd.png"
        ],
        "passive": "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character @0% ATK for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Moonpiercer"
    },
    "MouunsMoon": {
        "name": "Mouun's Moon",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Claw",
        "matStrongEnemy": "Mirror Maidens",
        "matWeakEnemy": "Specters",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/42\/Weapon_Mouun%27s_Moon.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e6\/Weapon_Mouun%27s_Moon_2nd.png"
        ],
        "passive": "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by @0%. A maximum of @1% increased Elemental Burst DMG can be achieved this way.",
        "refinementData": [
            {
                "1": 0.12,
                "2": 0.15,
                "3": 0.18,
                "4": 0.21,
                "5": 0.24
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Mouun%27s_Moon"
    },
    "OathswornEye": {
        "name": "Oathsworn Eye",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Branch",
        "matStrongEnemy": "Riftwolves",
        "matWeakEnemy": "Specters",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/af\/Weapon_Oathsworn_Eye.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0c\/Weapon_Oathsworn_Eye_2nd.png"
        ],
        "passive": "Increases Energy Recharge by @0% for 10s after using an Elemental Skill.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Oathsworn_Eye"
    },
    "PortablePowerSaw": {
        "name": "Portable Power Saw",
        "type": "Claymore",
        "rarity": 4,
        "baseATK": 41,
        "stat": "hp_",
        "passive": "When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain @0 Elemental Mastery, and 2s after the effect occurs, @1 Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 2,
                "2": 2.5,
                "3": 3,
                "4": 3.5,
                "5": 4
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Portable_Power_Saw",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/49\/Weapon_Portable_Power_Saw.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/40\/Weapon_Portable_Power_Saw_2nd.png"
        ],
        "matForgery": "Chalice",
        "matStrongEnemy": "Breacher Primus",
        "matWeakEnemy": "Meka"
    },
    "Predator": {
        "name": "Predator",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Claw",
        "matStrongEnemy": "Mirror Maidens",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2e\/Weapon_Predator.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/48\/Weapon_Predator_2nd.png"
        ],
        "passive": "Dealing Cryo DMG to opponents increases this character's Normal and Charged Attack DMG by 10% for 6s. This effect can have a maximum of 2 stacks.\nAdditionally, when Aloy equips Predator, ATK is increased by 66.",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Predator"
    },
    "ProspectorsDrill": {
        "name": "Prospector's Drill",
        "type": "Polearm",
        "rarity": 4,
        "baseATK": 44,
        "stat": "atk_",
        "passive": "When the wielder is healed or heals others, they will gain a Unity's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Struggle effect will be granted for 10s. For each Symbol consumed, gain @0% ATK and @1% All Elemental DMG Bonus. The Struggle effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.",
        "refinementData": [
            {
                "1": 3,
                "2": 4,
                "3": 5,
                "4": 6,
                "5": 7
            },
            {
                "1": 7,
                "2": 8.5,
                "3": 10,
                "4": 11.5,
                "5": 13
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Prospector%27s_Drill",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b1\/Weapon_Prospector%27s_Drill.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a9\/Weapon_Prospector%27s_Drill_2nd.png"
        ],
        "matForgery": "Chord",
        "matStrongEnemy": "Fatui Operatives",
        "matWeakEnemy": "Meka"
    },
    "PrototypeAmber": {
        "name": "Prototype Amber",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "hp_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2a\/Weapon_Prototype_Amber.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d2\/Weapon_Prototype_Amber_2nd.png"
        ],
        "passive": "Using an Elemental Burst regenerates @0 Energy every 2s for 6s. All party members will regenerate @1% HP every 2s for this duration.",
        "refinementData": [
            {
                "1": 4,
                "2": 4.5,
                "3": 5,
                "4": 5.5,
                "5": 6
            },
            {
                "1": 4,
                "2": 4.5,
                "3": 5,
                "4": 5.5,
                "5": 6
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Prototype_Amber"
    },
    "PrototypeArchaic": {
        "name": "Prototype Archaic",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ab\/Weapon_Prototype_Archaic.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/86\/Weapon_Prototype_Archaic_2nd.png"
        ],
        "passive": "On hit, Normal or Charged Attacks have a 50% chance to deal an additional @0% ATK DMG to opponents within a small AoE. Can only occur once every 15s.",
        "refinementData": [
            {
                "1": 240,
                "2": 300,
                "3": 360,
                "4": 420,
                "5": 480
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Prototype_Archaic"
    },
    "PrototypeCrescent": {
        "name": "Prototype Crescent",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/43\/Weapon_Prototype_Crescent.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/7d\/Weapon_Prototype_Crescent_2nd.png"
        ],
        "passive": "Charged Attack hits on weak points increase Movement SPD by 10% and ATK by @0% for 10s.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "atk_",
                    "@0"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 36,
                "2": 45,
                "3": 54,
                "4": 63,
                "5": 72
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Prototype_Crescent"
    },
    "PrototypeRancour": {
        "name": "Prototype Rancour",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Fatui",
        "baseATK": 44,
        "stat": "physical_dmg_",
        "baseStat": 7.5,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ef\/Weapon_Prototype_Rancour.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fa\/Weapon_Prototype_Rancour_2nd.png"
        ],
        "passive": "On hit, Normal or Charged Attacks increase ATK and DEF by @0% for 6s. Max 4 stacks. This effect can only occur once every 0.3s.",
        "refinementData": [
            {
                "1": 4,
                "2": 5,
                "3": 6,
                "4": 7,
                "5": 8
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Prototype_Rancour"
    },
    "PrototypeStarglitter": {
        "name": "Prototype Starglitter",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 42,
        "stat": "enerRech_",
        "baseStat": 10,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/7e\/Weapon_Prototype_Starglitter.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/33\/Weapon_Prototype_Starglitter_2nd.png"
        ],
        "passive": "After using an Elemental Skill, increases Normal and Charged Attack DMG by @0% for 12s. Max 2 stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Prototype_Starglitter"
    },
    "Rainslasher": {
        "name": "Rainslasher",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Samachurls",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d4\/Weapon_Rainslasher.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0f\/Weapon_Rainslasher_2nd.png"
        ],
        "passive": "Increases DMG against opponents affected by Hydro or Electro by @0%.",
        "refinementData": [
            {
                "1": 20,
                "2": 24,
                "3": 28,
                "4": 32,
                "5": 36
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Rainslasher"
    },
    "RangeGauge": {
        "name": "Range Gauge",
        "type": "Bow",
        "rarity": 4,
        "baseATK": 44,
        "stat": "atk_",
        "passive": "When the wielder is healed or heals others, they will gain a Unity's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Struggle effect will be granted for 10s. For each Symbol consumed, gain @0% ATK and @1% All Elemental DMG Bonus. The Struggle effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.",
        "refinementData": [
            {
                "1": 3,
                "2": 4,
                "3": 5,
                "4": 6,
                "5": 7
            },
            {
                "1": 7,
                "2": 8.5,
                "3": 10,
                "4": 11.5,
                "5": 13
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Range_Gauge",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/11\/Weapon_Range_Gauge.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/be\/Weapon_Range_Gauge_2nd.png"
        ],
        "matForgery": "Chord",
        "matStrongEnemy": "Hydro Phantasms",
        "matWeakEnemy": "Fontemer"
    },
    "RightfulReward": {
        "name": "Rightful Reward",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/8d\/Weapon_Rightful_Reward.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/dc\/Weapon_Rightful_Reward_2nd.png"
        ],
        "rarity": 4,
        "type": "Polearm",
        "passive": "When the wielder is healed, restore @0 Energy. This effect can triggered once every 10s, and can occur even when the character is not on the field.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "matForgery": "Chalice",
        "matStrongEnemy": "Breacher Primuses",
        "matWeakEnemy": "Meka",
        "baseATK": 44,
        "stat": "hp_",
        "baseStat": 6,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Rightful_Reward"
    },
    "RoyalBow": {
        "name": "Royal Bow",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/99\/Weapon_Royal_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4e\/Weapon_Royal_Bow_2nd.png"
        ],
        "passive": "Upon dealing damage to an opponent, increases CRIT Rate by @0%. Max 5 stacks. A CRIT hit removes all existing stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Royal_Bow"
    },
    "RoyalGreatsword": {
        "name": "Royal Greatsword",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/bf\/Weapon_Royal_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2b\/Weapon_Royal_Greatsword_2nd.png"
        ],
        "passive": "Upon dealing damage to an opponent, increases CRIT Rate by @0%. Max 5 stacks. A CRIT hit removes all existing stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Royal_Greatsword"
    },
    "RoyalGrimoire": {
        "name": "Royal Grimoire",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Fatui",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/99\/Weapon_Royal_Grimoire.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/69\/Weapon_Royal_Grimoire_2nd.png"
        ],
        "passive": "Upon dealing damage to an opponent, increases CRIT Rate by @0%. Max 5 stacks. A CRIT hit removes all existing stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Royal_Grimoire"
    },
    "RoyalLongsword": {
        "name": "Royal Longsword",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/cd\/Weapon_Royal_Longsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/84\/Weapon_Royal_Longsword_2nd.png"
        ],
        "passive": "Upon dealing damage to an opponent, increases CRIT Rate by @0%. Max 5 stacks. A CRIT hit removes all existing stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Royal_Longsword"
    },
    "RoyalSpear": {
        "name": "Royal Spear",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Fatui",
        "baseATK": 44,
        "stat": "atk_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fd\/Weapon_Royal_Spear.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/92\/Weapon_Royal_Spear_2nd.png"
        ],
        "passive": "Upon dealing damage to an opponent, increases CRIT Rate by @0%. Max 5 stacks. A CRIT hit removes all existing stacks.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Royal_Spear"
    },
    "Rust": {
        "name": "Rust",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1c\/Weapon_Rust.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/66\/Weapon_Rust_2nd.png"
        ],
        "passive": "Increases Normal Attack DMG by @0% but decreases Charged Attack DMG by 10%.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Rust"
    },
    "SacrificialBow": {
        "name": "Sacrificial Bow",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/ec\/Weapon_Sacrificial_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b4\/Weapon_Sacrificial_Bow_2nd.png"
        ],
        "passive": "After dealing damage to an opponent with an Elemental Skill, the skill has a @0% chance to end its own CD. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 30,
                "2": 26.5,
                "3": 23,
                "4": 19.5,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sacrificial_Bow"
    },
    "SacrificialFragments": {
        "name": "Sacrificial Fragments",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 41,
        "stat": "eleMas",
        "baseStat": 48,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6c\/Weapon_Sacrificial_Fragments.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/94\/Weapon_Sacrificial_Fragments_2nd.png"
        ],
        "passive": "After dealing damage to an opponent with an Elemental Skill, the skill has a @0% chance to end its own CD. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 30,
                "2": 26.5,
                "3": 23,
                "4": 19.5,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sacrificial_Fragments"
    },
    "SacrificialGreatsword": {
        "name": "Sacrificial Greatsword",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/17\/Weapon_Sacrificial_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9f\/Weapon_Sacrificial_Greatsword_2nd.png"
        ],
        "passive": "After dealing damage to an opponent with an Elemental Skill, the skill has a @0% chance to end its own CD. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 30,
                "2": 26.5,
                "3": 23,
                "4": 19.5,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sacrificial_Greatsword"
    },
    "SacrificialJade": {
        "name": "Sacrificial Jade",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/86\/Weapon_Sacrificial_Jade.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/79\/Weapon_Sacrificial_Jade_2nd.png"
        ],
        "rarity": 4,
        "type": "Catalyst",
        "passive": "When not on the field for more than 5s, Max HP will be increased by @0% and Elemental Mastery will be increased by @1. These effects will be canceled after the wielder has been on the field for 10s.",
        "refinementData": [
            {
                "1": 32,
                "2": 40,
                "3": 48,
                "4": 56,
                "5": 64
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "code": [
            "proc",
            [
                [
                    "stat",
                    [
                        "hp_",
                        "@0"
                    ]
                ],
                [
                    "stat",
                    [
                        "eleMas",
                        "@1"
                    ]
                ]
            ],
            "After 5s off field (10s)"
        ],
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Samachurls",
        "baseATK": 41,
        "stat": "critRate_",
        "baseStat": 8,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sacrificial_Jade"
    },
    "SacrificialSword": {
        "name": "Sacrificial Sword",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 41,
        "stat": "enerRech_",
        "baseStat": 13.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a0\/Weapon_Sacrificial_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/df\/Weapon_Sacrificial_Sword_2nd.png"
        ],
        "passive": "After dealing damage to an opponent with an Elemental Skill, the skill has a @0% chance to end its own CD. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 30,
                "2": 26.5,
                "3": 23,
                "4": 19.5,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sacrificial_Sword"
    },
    "SapwoodBlade": {
        "name": "Sapwood Blade",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Talisman",
        "matStrongEnemy": "Ruin Drakes",
        "matWeakEnemy": "Eremites",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/00\/Weapon_Sapwood_Blade.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/29\/Weapon_Sapwood_Blade_2nd.png"
        ],
        "passive": "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character @0 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "eleMas",
                    "@0"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 60,
                "2": 75,
                "3": 90,
                "4": 105,
                "5": 120
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sapwood_Blade"
    },
    "ScionOfTheBlazingSun": {
        "name": "Scion of the Blazing Sun",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/83\/Weapon_Scion_of_the_Blazing_Sun.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f3\/Weapon_Scion_of_the_Blazing_Sun_2nd.png"
        ],
        "rarity": 4,
        "type": "Bow",
        "passive": "After a Charged Attack hits an opponent, a Sunfire Arrow will descend upon the opponent hit, dealing @0% ATK as DMG, and applying the Heartsearer effect to the opponent damaged by said Arrow for 10s. Opponents affected by Heartsearer take @1% more Charged Attack DMG from the wielder. A Sunfire Arrow can be triggered once every 10s.",
        "refinementData": [
            {
                "1": 60,
                "2": 75,
                "3": 90,
                "4": 105,
                "5": 120
            },
            {
                "1": 28,
                "2": 35,
                "3": 42,
                "4": 49,
                "5": 56
            }
        ],
        "matForgery": "Scarab",
        "matStrongEnemy": "Hilichurl Rogues",
        "matWeakEnemy": "Fungi",
        "baseATK": 44,
        "stat": "critRate_",
        "baseStat": 4,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Scion_of_the_Blazing_Sun"
    },
    "SerpentSpine": {
        "name": "Serpent Spine",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "critRate_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/88\/Weapon_Serpent_Spine.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/10\/Weapon_Serpent_Spine_2nd.png"
        ],
        "passive": "Every 4s a character is on the field, they will deal @0% more DMG and take @1%  more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.",
        "code": [
            "proc",
            [
                [
                    "stat",
                    [
                        "dmg_",
                        "@0"
                    ]
                ],
                [
                    "stat",
                    [
                        "inDmg_",
                        "@1"
                    ]
                ]
            ],
            5
        ],
        "refinementData": [
            {
                "1": 6,
                "2": 7,
                "3": 8,
                "4": 9,
                "5": 10
            },
            {
                "1": 3,
                "2": 2.75,
                "3": 2.5,
                "4": 2.25,
                "5": 2
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Serpent_Spine"
    },
    "SnowTombedStarsilver": {
        "name": "Snow-Tombed Starsilver",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "physical_dmg_",
        "baseStat": 7.5,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/49\/Weapon_Snow-Tombed_Starsilver.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a1\/Weapon_Snow-Tombed_Starsilver_2nd.png"
        ],
        "passive": "Hitting an opponent with Normal and Charged Attacks has a @0% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to @1% of ATK. Opponents affected by Cryo are instead dealt DMG equal to @2% of ATK. Can only occur once every 10s.",
        "refinementData": [
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            },
            {
                "1": 80,
                "2": 95,
                "3": 110,
                "4": 125,
                "5": 140
            },
            {
                "1": 200,
                "2": 240,
                "3": 280,
                "4": 320,
                "5": 360
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Snow-Tombed_Starsilver"
    },
    "SolarPearl": {
        "name": "Solar Pearl",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "critRate_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fc\/Weapon_Solar_Pearl.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a2\/Weapon_Solar_Pearl_2nd.png"
        ],
        "passive": "Normal Attack hits increase Elemental Skill and Elemental Burst DMG by @0% for 6s. Likewise, Elemental Skill or Elemental Burst hits increase Normal Attack DMG by @1% for 6s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Solar_Pearl"
    },
    "SongOfStillness": {
        "name": "Song of Stillness",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/bd\/Weapon_Song_of_Stillness.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/21\/Weapon_Song_of_Stillness_2nd.png"
        ],
        "rarity": 4,
        "type": "Bow",
        "passive": "After the wielder is healed, they will deal @0% more DMG for 8s. This can be triggered even when the character is not on the field.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            }
        ],
        "matForgery": "Chord",
        "matStrongEnemy": "Hydro Phantasms",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Song_of_Stillness"
    },
    "SwordOfDescension": {
        "name": "Sword of Descension",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 39,
        "stat": "atk_",
        "baseStat": 7.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/17\/Weapon_Sword_of_Descension.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a8\/Weapon_Sword_of_Descension_2nd.png"
        ],
        "passive": "Hitting enemies with Normal or Charged Attacks grants a 50% chance to deal 200% ATK as DMG in a small AoE. This effect can only occur once every 10s.\nAdditionally, if the Traveler equips the Sword of Descension, their ATK is increased by 66.",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sword_of_Descension"
    },
    "SwordOfNarzissenkreuz": {
        "name": "Sword of Narzissenkreuz",
        "type": "Sword",
        "rarity": 4,
        "baseATK": 42,
        "stat": "atk_",
        "passive": "When the equipping character does not have an Arkhe: When Normal Attacks, Charged Attacks, or Plunging Attacks strike, a Pneuma or Ousia energy blast will be unleashed, dealing @0% of ATK as DMG. This effect can be triggered once every 12s. The energy blast type is determined by the current type of the Sword of Narzissenkreuz.",
        "refinementData": [
            {
                "1": 160,
                "2": 200,
                "3": 240,
                "4": 280,
                "5": 320
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sword_of_Narzissenkreuz",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1f\/Weapon_Sword_of_Narzissenkreuz_Pneuma.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/30\/Weapon_Sword_of_Narzissenkreuz_Ousia.png"
        ],
        "matForgery": "Chord",
        "matStrongEnemy": "Fatui Operatives",
        "matWeakEnemy": "Fontemer"
    },
    "TalkingStick": {
        "name": "Talking Stick",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/28\/Weapon_Talking_Stick.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c8\/Weapon_Talking_Stick_2nd.png"
        ],
        "rarity": 4,
        "type": "Claymore",
        "passive": "ATK will be increased by @0% for 15s after being affected by Pyro. This effect can be triggered once every 12s. All Elemental DMG Bonus will be increased by @1% for 15s after being affected by Hydro, Cryo, Electro, or Dendro. This effect can be triggered once every 12s.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "matForgery": "Plate",
        "matStrongEnemy": "Consecrated Beasts",
        "matWeakEnemy": "Slimes",
        "baseATK": 44,
        "stat": "critRate_",
        "baseStat": 4,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Talking_Stick"
    },
    "TheAlleyFlash": {
        "name": "The Alley Flash",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Samachurls",
        "baseATK": 45,
        "stat": "eleMas",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/83\/Weapon_The_Alley_Flash.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/ac\/Weapon_The_Alley_Flash_2nd.png"
        ],
        "passive": "Increases DMG dealt by the character equipping this weapon by @0%. Taking DMG disables this effect for 5s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Alley_Flash"
    },
    "TheBell": {
        "name": "The Bell",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "hp_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6e\/Weapon_The_Bell.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/3d\/Weapon_The_Bell_2nd.png"
        ],
        "passive": "Taking DMG generates a shield which absorbs DMG up to @0% of max HP. This shield lasts for 10s or until broken, and can only be triggered once every 45s. While protected by a shield, the character gains @1% increased DMG.",
        "refinementData": [
            {
                "1": 20,
                "2": 23,
                "3": 26,
                "4": 29,
                "5": 32
            },
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Bell"
    },
    "TheBlackSword": {
        "name": "The Black Sword",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 42,
        "stat": "critRate_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/cf\/Weapon_The_Black_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/47\/Weapon_The_Black_Sword_2nd.png"
        ],
        "passive": "Increases DMG dealt by Normal and Charged Attacks by @0%.\nAdditionally, regenerates @1% of ATK as HP when Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.",
        "code": [
            "stat",
            [
                [
                    "normal_dmg_",
                    "charged_dmg_"
                ],
                "@0"
            ]
        ],
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            },
            {
                "1": 60,
                "2": 70,
                "3": 80,
                "4": 90,
                "5": 100
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Black_Sword"
    },
    "TheDockhandsAssistant": {
        "name": "The Dockhand's Assistant",
        "type": "Sword",
        "rarity": 4,
        "baseATK": 42,
        "stat": "hp_",
        "passive": "When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain @0 Elemental Mastery, and 2s after the effect occurs, @1 Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 2,
                "2": 2.5,
                "3": 3,
                "4": 3.5,
                "5": 4
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Dockhand%27s_Assistant",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/eb\/Weapon_The_Dockhand%27s_Assistant.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b1\/Weapon_The_Dockhand%27s_Assistant_2nd.png"
        ],
        "matForgery": "Dewdrop",
        "matStrongEnemy": "Fatui Operatives",
        "matWeakEnemy": "Fontemer"
    },
    "TheFlute": {
        "name": "The Flute",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/63\/Weapon_The_Flute.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/37\/Weapon_The_Flute_2nd.png"
        ],
        "passive": "Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power of music and deals @0% ATK DMG to surrounding enemies. Harmonics last up to 30s, and a maximum of 1 can be gained every 0.5s.",
        "refinementData": [
            {
                "1": 100,
                "2": 125,
                "3": 150,
                "4": 175,
                "5": 200
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Flute"
    },
    "TheStringless": {
        "name": "The Stringless",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/71\/Weapon_The_Stringless.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f0\/Weapon_The_Stringless_2nd.png"
        ],
        "passive": "Increases Elemental Skill and Elemental Burst DMG by @0%.",
        "code": [
            "stat",
            [
                [
                    "skill_dmg_",
                    "burst_dmg_"
                ],
                "@0"
            ]
        ],
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Stringless"
    },
    "TheViridescentHunt": {
        "name": "The Viridescent Hunt",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 42,
        "stat": "critRate_",
        "baseStat": 6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/ff\/Weapon_The_Viridescent_Hunt.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/be\/Weapon_The_Viridescent_Hunt_2nd.png"
        ],
        "passive": "Upon hit, Normal and Aimed Shot Attacks have a 50% chance to generate a Cyclone, which will continuously attract surrounding opponents, dealing @0% of ATK as DMG to these opponents every 0.5s for 4s. This effect can only occur once every @1s.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            },
            {
                "1": 14,
                "2": 13,
                "3": 12,
                "4": 11,
                "5": 10
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Viridescent_Hunt"
    },
    "TheWidsith": {
        "name": "The Widsith",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 42,
        "stat": "critDMG_",
        "baseStat": 12,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f0\/Weapon_The_Widsith.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d1\/Weapon_The_Widsith_2nd.png"
        ],
        "passive": "When a character takes the field, they will gain a random theme song for 10s. This can only occur once every 30s.\nRecitative: ATK is increased by @0%.\nAria: Increases all Elemental DMG by @1%.\nInterlude: Elemental Mastery is increased by @2.",
        "refinementData": [
            {
                "1": 60,
                "2": 75,
                "3": 90,
                "4": 105,
                "5": 120
            },
            {
                "1": 48,
                "2": 60,
                "3": 72,
                "4": 84,
                "5": 96
            },
            {
                "1": 240,
                "2": 300,
                "3": 360,
                "4": 420,
                "5": 480
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/The_Widsith"
    },
    "TidalShadow": {
        "name": "Tidal Shadow",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/69\/Weapon_Tidal_Shadow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/17\/Weapon_Tidal_Shadow_2nd.png"
        ],
        "rarity": 4,
        "type": "Claymore",
        "passive": "After the wielder is healed, ATK will be increased by @0% for 8s. This can be triggered even when the character is not on the field.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "matForgery": "Chalice",
        "matStrongEnemy": "Breacher Primuses",
        "matWeakEnemy": "Meka",
        "baseATK": 42,
        "stat": "atk_",
        "baseStat": 9,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Tidal_Shadow"
    },
    "ToukabouShigure": {
        "name": "Toukabou Shigure",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Claw",
        "matStrongEnemy": "Primal Constructs",
        "matWeakEnemy": "Nobushi",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b5\/Weapon_Toukabou_Shigure.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/88\/Weapon_Toukabou_Shigure_2nd.png"
        ],
        "passive": "After an attack hits opponents, it will inflict an instance of Cursed Parasol upon one of them for 10s. This effect can be triggered once every 15s. If this opponent is defeated during Cursed Parasol's duration, Cursed Parasol's CD will be refreshed immediately. The character wielding this weapon will deal @0% more DMG to the opponent affected by Cursed Parasol.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Toukabou_Shigure"
    },
    "WanderingEvenstar": {
        "name": "Wandering Evenstar",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Plate",
        "matStrongEnemy": "Activated Fungi",
        "matWeakEnemy": "Fungi",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/44\/Weapon_Wandering_Evenstar.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/76\/Weapon_Wandering_Evenstar_2nd.png"
        ],
        "passive": "The following effect will trigger every 10s: The equipping character will gain @0% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Wandering_Evenstar"
    },
    "WavebreakersFin": {
        "name": "Wavebreaker's Fin",
        "rarity": 4,
        "type": "Polearm",
        "matForgery": "Mask",
        "matStrongEnemy": "Riftwolves",
        "matWeakEnemy": "Nobushi",
        "baseATK": 45,
        "stat": "atk_",
        "baseStat": 3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/66\/Weapon_Wavebreaker%27s_Fin.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e4\/Weapon_Wavebreaker%27s_Fin_2nd.png"
        ],
        "passive": "For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by @0%. A maximum of @1% increased Elemental Burst DMG can be achieved this way.",
        "refinementData": [
            {
                "1": 0.12,
                "2": 0.15,
                "3": 0.18,
                "4": 0.21,
                "5": 0.24
            },
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Wavebreaker%27s_Fin"
    },
    "Whiteblind": {
        "name": "Whiteblind",
        "rarity": 4,
        "type": "Claymore",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 42,
        "stat": "def_",
        "baseStat": 11.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/04\/Weapon_Whiteblind.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e9\/Weapon_Whiteblind_2nd.png"
        ],
        "passive": "On hit, Normal or Charged Attacks increase ATK and DEF by @0% for 6s. Max 4 stacks (@1%  total). Can only occur once every 0.5s.",
        "refinementData": [
            {
                "1": 6,
                "2": 7.5,
                "3": 9,
                "4": 10.5,
                "5": 12
            },
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Whiteblind"
    },
    "WindblumeOde": {
        "name": "Windblume Ode",
        "rarity": 4,
        "type": "Bow",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/38\/Weapon_Windblume_Ode.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6c\/Weapon_Windblume_Ode_2nd.png"
        ],
        "passive": "After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing ATK by @0% for 6s.",
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Windblume_Ode"
    },
    "WineAndSong": {
        "name": "Wine and Song",
        "rarity": 4,
        "type": "Catalyst",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 44,
        "stat": "enerRech_",
        "baseStat": 6.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c6\/Weapon_Wine_and_Song.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/57\/Weapon_Wine_and_Song_2nd.png"
        ],
        "passive": "Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate Sprint by @0% for 5s. Additionally, using a Sprint or Alternate Sprint ability increases ATK by @1% for 5s.",
        "refinementData": [
            {
                "1": 14,
                "2": 16,
                "3": 18,
                "4": 20,
                "5": 22
            },
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Wine_and_Song"
    },
    "WolfFang": {
        "name": "Wolf-Fang",
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e3\/Weapon_Wolf-Fang.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a4\/Weapon_Wolf-Fang_2nd.png"
        ],
        "rarity": 4,
        "type": "Sword",
        "passive": "DMG dealt by Elemental Skill and Elemental Burst is increased by @0%. When an Elemental Skill hits an opponent, its CRIT Rate will be increased by @1%. When an Elemental Burst hits an opponent, its CRIT Rate will be increased by @2%. Both of these effects last 10s separately, have 4 max stacks, and can be triggered once every 0.1s.",
        "code": [
            [
                "stat",
                [
                    [
                        "skill_dmg_",
                        "burst_dmg_"
                    ],
                    "@0"
                ]
            ],
            [
                "proc",
                [
                    "sstat",
                    [
                        "critRate_",
                        "@1",
                        "Elemental Skill"
                    ]
                ],
                "After Elemental Skill Hit (10s)",
                4
            ],
            [
                "proc",
                [
                    "sstat",
                    [
                        "critRate_",
                        "@2",
                        "Elemental Burst"
                    ]
                ],
                "After Elemental Burst Hit (10s)",
                4
            ]
        ],
        "refinementData": [
            {
                "1": 16,
                "2": 20,
                "3": 24,
                "4": 28,
                "5": 32
            },
            {
                "1": 2,
                "2": 2.5,
                "3": 3,
                "4": 3.5,
                "5": 4
            },
            {
                "1": 2,
                "2": 2.5,
                "3": 3,
                "4": 3.5,
                "5": 4
            }
        ],
        "matForgery": "Tile",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 42,
        "stat": "critRate_",
        "baseStat": 6,
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Wolf-Fang"
    },
    "XiphosMoonlight": {
        "name": "Xiphos' Moonlight",
        "rarity": 4,
        "type": "Sword",
        "matForgery": "Talisman",
        "matStrongEnemy": "Primal Constructs",
        "matWeakEnemy": "Eremites",
        "baseATK": 42,
        "stat": "eleMas",
        "baseStat": 36,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/8a\/Weapon_Xiphos%27_Moonlight.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/40\/Weapon_Xiphos%27_Moonlight_2nd.png"
        ],
        "passive": "The following effect will trigger every 10s: The equipping character will gain @0% Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.",
        "refinementData": [
            {
                "1": 0.036,
                "2": 0.045,
                "3": 0.05399999999999999,
                "4": 0.063,
                "5": 0.072
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Xiphos%27_Moonlight"
    },
    "BlackTassel": {
        "name": "Black Tassel",
        "rarity": 3,
        "type": "Polearm",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 38,
        "stat": "hp_",
        "baseStat": 10.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/43\/Weapon_Black_Tassel.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d8\/Weapon_Black_Tassel_2nd.png"
        ],
        "passive": "Increases DMG against slimes by @0%.",
        "refinementData": [
            {
                "1": 40,
                "2": 50,
                "3": 60,
                "4": 70,
                "5": 80
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Black_Tassel"
    },
    "BloodtaintedGreatsword": {
        "name": "Bloodtainted Greatsword",
        "rarity": 3,
        "type": "Claymore",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 38,
        "stat": "eleMas",
        "baseStat": 41,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4a\/Weapon_Bloodtainted_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/10\/Weapon_Bloodtainted_Greatsword_2nd.png"
        ],
        "passive": "Increases DMG against opponents affected by Pyro or Electro by @0%.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Bloodtainted_Greatsword"
    },
    "CoolSteel": {
        "name": "Cool Steel",
        "rarity": 3,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 39,
        "stat": "atk_",
        "baseStat": 7.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9c\/Weapon_Cool_Steel.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/20\/Weapon_Cool_Steel_2nd.png"
        ],
        "passive": "Increases DMG against opponents affected by Hydro or Cryo by @0%.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Cool_Steel"
    },
    "DarkIronSword": {
        "name": "Dark Iron Sword",
        "rarity": 3,
        "type": "Sword",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 39,
        "stat": "eleMas",
        "baseStat": 31,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/3a\/Weapon_Dark_Iron_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/11\/Weapon_Dark_Iron_Sword_2nd.png"
        ],
        "passive": "Upon causing an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, or Electro-infused Swirl reaction, ATK is increased by @0% for 12s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Dark_Iron_Sword"
    },
    "DebateClub": {
        "name": "Debate Club",
        "rarity": 3,
        "type": "Claymore",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 39,
        "stat": "atk_",
        "baseStat": 7.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/74\/Weapon_Debate_Club.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/3d\/Weapon_Debate_Club_2nd.png"
        ],
        "passive": "After using an Elemental Skill, Normal or Charged Attacks, on hit, deal an additional @0% ATK DMG in a small area. Effect lasts 15s. DMG can only occur once every 3s.",
        "refinementData": [
            {
                "1": 60,
                "2": 75,
                "3": 90,
                "4": 105,
                "5": 120
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Debate_Club"
    },
    "EmeraldOrb": {
        "name": "Emerald Orb",
        "rarity": 3,
        "type": "Catalyst",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 40,
        "stat": "eleMas",
        "baseStat": 20,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/7\/7c\/Weapon_Emerald_Orb.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/18\/Weapon_Emerald_Orb_2nd.png"
        ],
        "passive": "Upon causing a Vaporize, Electro-Charged, Frozen, Bloom, or a Hydro-infused Swirl reaction, increases ATK by @0% for 12s.",
        "refinementData": [
            {
                "1": 20,
                "2": 25,
                "3": 30,
                "4": 35,
                "5": 40
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Emerald_Orb"
    },
    "FerrousShadow": {
        "name": "Ferrous Shadow",
        "rarity": 3,
        "type": "Claymore",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 39,
        "stat": "hp_",
        "baseStat": 7.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e9\/Weapon_Ferrous_Shadow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0b\/Weapon_Ferrous_Shadow_2nd.png"
        ],
        "passive": "When HP falls below @0%, increases Charged Attack DMG by @1%, and Charged Attacks become much harder to interrupt.",
        "refinementData": [
            {
                "1": 70,
                "2": 75,
                "3": 80,
                "4": 85,
                "5": 90
            },
            {
                "1": 30,
                "2": 35,
                "3": 40,
                "4": 45,
                "5": 50
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Ferrous_Shadow"
    },
    "FilletBlade": {
        "name": "Fillet Blade",
        "rarity": 3,
        "type": "Sword",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 39,
        "stat": "atk_",
        "baseStat": 7.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/f7\/Weapon_Fillet_Blade.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/14\/Weapon_Fillet_Blade_2nd.png"
        ],
        "passive": "On hit, has 50% chance to deal @0% ATK DMG to a single enemy. Can only occur once every @1s.",
        "refinementData": [
            {
                "1": 240,
                "2": 280,
                "3": 320,
                "4": 360,
                "5": 400
            },
            {
                "1": 15,
                "2": 14,
                "3": 13,
                "4": 12,
                "5": 11
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Fillet_Blade"
    },
    "Halberd": {
        "name": "Halberd",
        "rarity": 3,
        "type": "Polearm",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Whopperflowers",
        "baseATK": 40,
        "stat": "atk_",
        "baseStat": 5.1,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/41\/Weapon_Halberd.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a6\/Weapon_Halberd_2nd.png"
        ],
        "passive": "Normal Attacks deal an additional @0% DMG. Can only occur once every 10s.",
        "refinementData": [
            {
                "1": 160,
                "2": 200,
                "3": 240,
                "4": 280,
                "5": 320
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Halberd"
    },
    "HarbingerOfDawn": {
        "name": "Harbinger of Dawn",
        "rarity": 3,
        "type": "Sword",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 39,
        "stat": "critDMG_",
        "baseStat": 10.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/23\/Weapon_Harbinger_of_Dawn.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fd\/Weapon_Harbinger_of_Dawn_2nd.png"
        ],
        "passive": "When HP is above 90%, increases CRIT Rate by @0%.",
        "code": [
            "proc",
            [
                "stat",
                [
                    "critRate_",
                    "@0"
                ]
            ]
        ],
        "refinementData": [
            {
                "1": 14,
                "2": 17.5,
                "3": 21,
                "4": 24.5,
                "5": 28
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Harbinger_of_Dawn"
    },
    "MagicGuide": {
        "name": "Magic Guide",
        "rarity": 3,
        "type": "Catalyst",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Slimes",
        "baseATK": 38,
        "stat": "eleMas",
        "baseStat": 41,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/39\/Weapon_Magic_Guide.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4c\/Weapon_Magic_Guide_2nd.png"
        ],
        "passive": "Increases DMG against opponents affected by Hydro or Electro by @0%.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Magic_Guide"
    },
    "Messenger": {
        "name": "Messenger",
        "rarity": 3,
        "type": "Bow",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 40,
        "stat": "critDMG_",
        "baseStat": 6.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/38\/Weapon_Messenger.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/db\/Weapon_Messenger_2nd.png"
        ],
        "passive": "Charged Attack hits on weak spots deal an additional @0% ATK DMG as CRIT DMG. Can only occur once every 10s.",
        "refinementData": [
            {
                "1": 100,
                "2": 125,
                "3": 150,
                "4": 175,
                "5": 200
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Messenger"
    },
    "OtherworldlyStory": {
        "name": "Otherworldly Story",
        "rarity": 3,
        "type": "Catalyst",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 39,
        "stat": "enerRech_",
        "baseStat": 8.5,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/11\/Weapon_Otherworldly_Story.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/a\/a8\/Weapon_Otherworldly_Story_2nd.png"
        ],
        "passive": "Each Elemental Orb or Particle collected restores @0% HP.",
        "refinementData": [
            {
                "1": 1,
                "2": 1.25,
                "3": 1.5,
                "4": 1.75,
                "5": 2
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Otherworldly_Story"
    },
    "RavenBow": {
        "name": "Raven Bow",
        "rarity": 3,
        "type": "Bow",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 40,
        "stat": "eleMas",
        "baseStat": 20,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/d0\/Weapon_Raven_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/15\/Weapon_Raven_Bow_2nd.png"
        ],
        "passive": "Increases DMG against opponents affected by Hydro or Pyro by @0%.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Raven_Bow"
    },
    "RecurveBow": {
        "name": "Recurve Bow",
        "rarity": 3,
        "type": "Bow",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 38,
        "stat": "hp_",
        "baseStat": 10.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/b5\/Weapon_Recurve_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/82\/Weapon_Recurve_Bow_2nd.png"
        ],
        "passive": "Defeating an opponent restores @0% HP.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Recurve_Bow"
    },
    "SharpshootersOath": {
        "name": "Sharpshooter's Oath",
        "rarity": 3,
        "type": "Bow",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 39,
        "stat": "critDMG_",
        "baseStat": 10.2,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/52\/Weapon_Sharpshooter%27s_Oath.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/19\/Weapon_Sharpshooter%27s_Oath_2nd.png"
        ],
        "passive": "Increases DMG against weak spots by @0%.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Sharpshooter%27s_Oath"
    },
    "SkyriderGreatsword": {
        "name": "Skyrider Greatsword",
        "rarity": 3,
        "type": "Claymore",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 39,
        "stat": "physical_dmg_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/6e\/Weapon_Skyrider_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9f\/Weapon_Skyrider_Greatsword_2nd.png"
        ],
        "passive": "On hit, Normal or Charged Attacks increase ATK by @0% for 6s. Max 4 stacks. Can only occur once every 0.5s.",
        "refinementData": [
            {
                "1": 6,
                "2": 7,
                "3": 8,
                "4": 9,
                "5": 10
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyrider_Greatsword"
    },
    "SkyriderSword": {
        "name": "Skyrider Sword",
        "rarity": 3,
        "type": "Sword",
        "matForgery": "Aeros",
        "matStrongEnemy": "Geovishaps",
        "matWeakEnemy": "Fatui",
        "baseATK": 38,
        "stat": "enerRech_",
        "baseStat": 11.3,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/34\/Weapon_Skyrider_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0a\/Weapon_Skyrider_Sword_2nd.png"
        ],
        "passive": "Using an Elemental Burst grants a @0% increase in ATK and Movement SPD for 15s.",
        "refinementData": [
            {
                "1": 12,
                "2": 15,
                "3": 18,
                "4": 21,
                "5": 24
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Skyrider_Sword"
    },
    "Slingshot": {
        "name": "Slingshot",
        "rarity": 3,
        "type": "Bow",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 38,
        "stat": "critRate_",
        "baseStat": 6.8,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/ca\/Weapon_Slingshot.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/60\/Weapon_Slingshot_2nd.png"
        ],
        "passive": "If a Normal or Charged Attack hits a target within 0.3s of being fired, increases DMG by @0%. Otherwise, decreases DMG by 10%.",
        "refinementData": [
            {
                "1": 36,
                "2": 42,
                "3": 48,
                "4": 54,
                "5": 60
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Slingshot"
    },
    "ThrillingTalesOfDragonSlayers": {
        "name": "Thrilling Tales of Dragon Slayers",
        "rarity": 3,
        "type": "Catalyst",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Samachurls",
        "baseATK": 39,
        "stat": "hp_",
        "baseStat": 7.7,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/19\/Weapon_Thrilling_Tales_of_Dragon_Slayers.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/9\/9e\/Weapon_Thrilling_Tales_of_Dragon_Slayers_2nd.png"
        ],
        "passive": "When switching characters, the new character taking the field has their ATK increased by @0% for 10s. This effect can only occur once every 20s.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Thrilling_Tales_of_Dragon_Slayers"
    },
    "TravelersHandySword": {
        "name": "Traveler's Handy Sword",
        "rarity": 3,
        "type": "Sword",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 40,
        "stat": "def_",
        "baseStat": 6.4,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c9\/Weapon_Traveler%27s_Handy_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/d\/df\/Weapon_Traveler%27s_Handy_Sword_2nd.png"
        ],
        "passive": "Each Elemental Orb or Particle collected restores @0% HP.",
        "refinementData": [
            {
                "1": 1,
                "2": 1.25,
                "3": 1.5,
                "4": 1.75,
                "5": 2
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Traveler%27s_Handy_Sword"
    },
    "TwinNephrite": {
        "name": "Twin Nephrite",
        "rarity": 3,
        "type": "Catalyst",
        "matForgery": "Elixir",
        "matStrongEnemy": "Fatui Cicin Mages",
        "matWeakEnemy": "Fatui",
        "baseATK": 40,
        "stat": "critRate_",
        "baseStat": 3.4,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/e3\/Weapon_Twin_Nephrite.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/c4\/Weapon_Twin_Nephrite_2nd.png"
        ],
        "passive": "Defeating an opponent increases Movement SPD and ATK by @0% for 15s.",
        "refinementData": [
            {
                "1": 12,
                "2": 14,
                "3": 16,
                "4": 18,
                "5": 20
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Twin_Nephrite"
    },
    "WhiteIronGreatsword": {
        "name": "White Iron Greatsword",
        "rarity": 3,
        "type": "Claymore",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Slimes",
        "baseATK": 39,
        "stat": "def_",
        "baseStat": 9.6,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/56\/Weapon_White_Iron_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/e\/eb\/Weapon_White_Iron_Greatsword_2nd.png"
        ],
        "passive": "Defeating an opponent restores @0% HP.",
        "refinementData": [
            {
                "1": 8,
                "2": 10,
                "3": 12,
                "4": 14,
                "5": 16
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/White_Iron_Greatsword"
    },
    "WhiteTassel": {
        "name": "White Tassel",
        "rarity": 3,
        "type": "Polearm",
        "matForgery": "Guyun",
        "matStrongEnemy": "Fatui Agents",
        "matWeakEnemy": "Fatui",
        "baseATK": 39,
        "stat": "critRate_",
        "baseStat": 5.1,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/1f\/Weapon_White_Tassel.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/05\/Weapon_White_Tassel_2nd.png"
        ],
        "passive": "Increases Normal Attack DMG by @0%.",
        "refinementData": [
            {
                "1": 24,
                "2": 30,
                "3": 36,
                "4": 42,
                "5": 48
            }
        ],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/White_Tassel"
    },
    "IronPoint": {
        "name": "Iron Point",
        "rarity": 2,
        "type": "Polearm",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 33,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/25\/Weapon_Iron_Point.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/6\/64\/Weapon_Iron_Point_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Iron_Point"
    },
    "OldMercsPal": {
        "name": "Old Merc's Pal",
        "rarity": 2,
        "type": "Claymore",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 33,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/0\/0b\/Weapon_Old_Merc%27s_Pal.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/80\/Weapon_Old_Merc%27s_Pal_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Old_Merc%27s_Pal"
    },
    "PocketGrimoire": {
        "name": "Pocket Grimoire",
        "rarity": 2,
        "type": "Catalyst",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 33,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/1\/16\/Weapon_Pocket_Grimoire.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fa\/Weapon_Pocket_Grimoire_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Pocket_Grimoire"
    },
    "SeasonedHuntersBow": {
        "name": "Seasoned Hunter's Bow",
        "rarity": 2,
        "type": "Bow",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 33,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/82\/Weapon_Seasoned_Hunter%27s_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/8\/8b\/Weapon_Seasoned_Hunter%27s_Bow_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Seasoned_Hunter%27s_Bow"
    },
    "SilverSword": {
        "name": "Silver Sword",
        "rarity": 2,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 33,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/32\/Weapon_Silver_Sword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/bd\/Weapon_Silver_Sword_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Silver_Sword"
    },
    "ApprenticesNotes": {
        "name": "Apprentice's Notes",
        "rarity": 1,
        "type": "Catalyst",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hilichurls",
        "baseATK": 23,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/c\/cf\/Weapon_Apprentice%27s_Notes.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/bc\/Weapon_Apprentice%27s_Notes_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Apprentice%27s_Notes"
    },
    "BeginnersProtector": {
        "name": "Beginner's Protector",
        "rarity": 1,
        "type": "Polearm",
        "matForgery": "Cuffs",
        "matStrongEnemy": "Ruin Guards",
        "matWeakEnemy": "Samachurls",
        "baseATK": 23,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/f\/fc\/Weapon_Beginner%27s_Protector.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/5\/59\/Weapon_Beginner%27s_Protector_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Beginner%27s_Protector"
    },
    "DullBlade": {
        "name": "Dull Blade",
        "rarity": 1,
        "type": "Sword",
        "matForgery": "Tile",
        "matStrongEnemy": "Big Hilichurls",
        "matWeakEnemy": "Hili.Archers",
        "baseATK": 23,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/2\/2f\/Weapon_Dull_Blade.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/ba\/Weapon_Dull_Blade_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Dull_Blade"
    },
    "HuntersBow": {
        "name": "Hunter's Bow",
        "rarity": 1,
        "type": "Bow",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "T.Hoarders",
        "baseATK": 23,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/44\/Weapon_Hunter%27s_Bow.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/3\/31\/Weapon_Hunter%27s_Bow_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Hunter%27s_Bow"
    },
    "WasterGreatsword": {
        "name": "Waster Greatsword",
        "rarity": 1,
        "type": "Claymore",
        "matForgery": "Tooth",
        "matStrongEnemy": "Abyss Mages",
        "matWeakEnemy": "Slimes",
        "baseATK": 23,
        "stat": "",
        "baseStat": 0,
        "imgs": [
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/4\/4c\/Weapon_Waster_Greatsword.png",
            "https:\/\/static.wikia.nocookie.net\/gensin-impact\/images\/b\/bd\/Weapon_Waster_Greatsword_2nd.png"
        ],
        "passive": "None",
        "refinementData": [],
        "linkFandom": "https:\/\/genshin-impact.fandom.com\/wiki\/Waster_Greatsword"
    }
};
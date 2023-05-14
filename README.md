# Genshin Manager
A site where you can record all of your Genshin Impact characters/items/etc., and keep track of everything you need to progress, so you have access to all such information at a glance.

Features include:
* Import your data from GOOD format, created by programs such as [Inventory Kamera](https://github.com/Andrewthe13th/Inventory_Kamera) (recommended since it reads materials) and [Amenoma](https://github.com/daydreaming666/Amenoma).
* View a consolidated list of all of your characters, which shows you all of the mats they need for their next ascension as well as talent level-ups.
* As above, view a consolidated list of all of your weapons and their ascension materials, and which character is using each.
* View a list of all of your artifacts with not only their stats, but ratings of their stats, which are based on how much they rolled each specific substat, the probability of rolling each substat further, as well as a final rating that factors in all of your characters' build preferences (see further below) to rate how valuable the artifact is in its best-case-scenario.
* View your quantities of materials, with a list of which characters and weapons require that material for their next ascension or talent level-up.
* View a list of furniture gift sets, so you can track which gift sets you have learned and which characters you can settle/have settled using them, so you can more easily keep track of the primogems rewards for doing so.
* (Work-In-Progress*) For each character, create a build that specifies their artifact main stat/substat priority, which will be used in calculations to determine their best artifacts. * Currently, only some of the characters have builds, and they are hard-coded based on guides that I have read, but the goal is for you to be able to set up your own.
* For each character, see lists of all of your artifacts separated by slot, and sorted by how good they are for that character, based on the build(s) explained above.
* (Planned Feature) Specify desired artifact sets for each character, and see recommended artifact combinations that factor in the above builds as well as different combinations of your desired artifact sets.
* (Planned Feature) See each of your characters' stats based on their equipped weapon and artifacts, as well as how much damage they should be doing with various attacks, skills, bursts, reactions, etc. Additionally:
  * (Planned Feature) Also factor in triggered effects of artifacts or weapons, and how the damage values will change when such effects are triggered.
  * (Planned Feature) Allow you to see all of that information for multiple different artifact combinations at once, and use that to decide which one you prefer.
* (Planned Feature) Allow you to set up teams, and see how the buffs provided by each team members' abilities/artifacts/weapons will affect all of the aforementioned statistics.
* Export all of your data in GOOD format so you can use it on other devices or other websites.

## Alternatives
There are many other Genshin Impact managers that I am aware of, which serve similar purposes. They are all relatively specialized and probably do those things better than mine (for now, smile). However, I made this one because I did not want to have to use 3 different managers to get all the features I want. That said, with the ability to import/export data in GOOD format, you can use them alongside mine if you want to.
* [Genshin Optimizer](https://frzyc.github.io/genshin-optimizer): Helps you plan builds and artifact combinations to get the exact stats you want *far* better than my app will be able to do in the forseeable future. However, doesn't help you keep track of ascension or talent materials.
* [SEELIE.me](https://seelie.me): Helps keep track of ascension and talent materials and helps you plan what materials to farm, but you have to manually enter all characters and weapons, and it does nothing at all for artifacts.
* [Genshin Center's Planner](https://genshin-center.com/planner): Seems to be the same as SEELIE.me, as far as I can tell.
* [Genshin Impact Calculator](https://genshin.aspirine.su/): Does a bunch of calculations with stats and damage, including party set-up, and helps you select artifacts for your builds, but doesn't import/store any of your stuff except for artifacts.

That said, my app is going to have some weaknesses of its own that I'm not sure if/when I will be able to address:
* Slow to update. I'm lazy, and keeping up with patches is going to be a little delayed. However, perhaps the fact that this is on GitHub will motivate some contributors to help with that.
* Not sharing data across platforms. All data is stored on your browser, so it will be unavailable on any other browser or device. And if you lose access to your browser storage, all your saved data will be gone. However, the export feature will allow you to manually save your data to your drive, and you can use that saved file to transfer the data for use on another browser or device.

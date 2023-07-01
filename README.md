# Genshin Manager
https://kree-nickm.github.io/genshin-manager

A site where you can record all of your Genshin Impact characters/items/etc., and keep track of everything you need to progress, so you have access to all such information at a glance.

Features include:
* Import your data from GOOD format, generated by programs such as [Inventory Kamera](https://github.com/Andrewthe13th/Inventory_Kamera) and [Amenoma](https://github.com/daydreaming666/Amenoma).
* Export your data in GOOD format so you can use it on [other websites](#alternatives).
* Easily switch between multiple accounts and/or servers whose data you've added.
* View a consolidated list of all of your characters, which shows you all of the mats they need for their next ascension as well as talent level-ups.
* As above, view a consolidated list of all of your weapons and their ascension materials, and which character is using each.
* View a list of all of your artifacts with not only their stats, but ratings of their stats, which are based on how much they rolled each specific substat and the probability of rolling each substat further.
* View your quantities of materials, with a list of which characters and weapons require that material for their next ascension or talent level-up.
* View a list of furniture gift sets, so you can track which gift sets you have learned and which characters you can settle/have settled using them, so you can more easily keep track of the primogems rewards for doing so.
* For each character, create one or more builds that specify their desired artifact sets and artifact main stat/substat priority, which will be used in calculations to determine their best artifacts.
* For each character, see lists of all of your artifacts separated by slot, and sorted by how good they are for that character, based on the build(s) explained above.
* Using the above artifact preferences, run an algorithm that determines how valuable each artifact on your account is based on the number of you characters who might want to use it. Any artifacts that end up with a score of 0 are safe to use as fodder for levels/strongbox.
* _(Planned Feature)_ See recommended artifact combinations that factor in the above builds as well as different combinations of your desired artifact sets.
* _(Planned Feature)_ See each of your characters' stats based on their equipped weapon and artifacts, as well as how much damage they should be doing with various attacks, skills, bursts, reactions, etc. Additionally:
  * _(Planned Feature)_ Factor in triggered effects of artifacts or weapons, and how the damage values will change when such effects are triggered.
  * _(Planned Feature)_ Allow you to see all of that information for multiple different artifact combinations at once, and use that to decide which one you prefer.
* _(Planned Feature)_ Allow you to set up teams, and see how the buffs provided by each team members' abilities/artifacts/weapons will affect all of the aforementioned statistics.
* _(Planned Feature)_ Upload your account data somewhere, so that you can share it with other players, and they can review your entire account.
* _(Planned Feature)_ Obtain your character data from Hoyoverse directly using your profile (like Enka and Akasha), so you can have at least *some* account data imported without having to use screen readers.

## Alternatives
There are many other Genshin Impact managers that I am aware of, which serve similar purposes. They are all relatively specialized and probably do those things better than mine (for now, smile). However, I made this one because I did not want to have to use 3 different managers to get all the features I want. That said, with the ability to import/export data in GOOD format, you can use them alongside mine if you want to.
* [Genshin Optimizer](https://frzyc.github.io/genshin-optimizer): Helps you plan builds and artifact combinations to get the exact stats you want *far* better than my app will be able to do in the forseeable future. However, doesn't help you keep track of ascension or talent materials.
* [SEELIE.me](https://seelie.me): Helps keep track of ascension and talent materials and helps you plan what materials to farm, but you have to manually enter all characters and weapons, and it does nothing at all for artifacts.
* [Genshin Center's Planner](https://genshin-center.com/planner): Seems to be the same as SEELIE.me, as far as I can tell.
* [Genshin Impact Calculator](https://genshin.aspirine.su/): Does a bunch of calculations with stats and damage, including party set-up, and helps you select artifacts for your builds, but doesn't import/store any of your stuff except for artifacts.
* [Akasha](https://akasha.cv): Pulls your character data directly from your Genshin Impact account, but only stays updated for the 8 characters you display on your profile. Allows you to review various statistics and ratings for those characters and compare them to those of other players.
* [Enka](https://enka.network/): Similar to Akasha in that it pulls data directly from your account. Does not include any of the subjective ratings that Akasha does. Has a convenient display for each of your characters that makes it very easy for yourself and others to review character/weapon/artifact statistics.

That said, my app is going to have some weaknesses of its own that I'm not sure if/when I will be able to address:
* Slow to update. I'm lazy, and keeping up with patches is going to be a little delayed. However, perhaps the fact that this is on GitHub will motivate some contributors to help with that.
* Not sharing data across devices. All data is stored on your browser, so it will be unavailable on any other browser or device. And if you lose access to your browser storage, all your saved data will be gone. However, the export feature will allow you to manually save your data to your device, and you can use that saved file to transfer the data for use on another browser or device. However, I eventually plan to rectify this.
* Use shorthand for most things instead of images. This could be a pro or a con depending on your perspective (it's strictly a pro for me, but you might disagree). For example, rather than images for the talent level-up materials, I call them by what the image looks like (cuff, tile, branch, etc.) In the future I might consider adding a preference toggle for this kind of stuff, but I'm not planning on it any time soon.
* Related to the above point, I value function over form. This app won't look very pretty, and the interface may be confusing, but my concern is that it does what I want it to do. Once it has all the funtionality that I want, I will work on improving the UI/UX so that other people can figure out how to use it more easily, but not before.

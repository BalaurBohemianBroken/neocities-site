class Explore extends BActivity {
    locations = [
        "Docks",
        "Western Egress",
        "Boreal woodlands",
        "Markets",
        "Rock hospital",
        "Termitary",
    ]
}

class ExploreFail extends Explore {
    content = `You try to make yourself go out, but it just feels... pointless.`
}

class ExploreGeneric extends Explore {
    content = `Without much else to do, you take to the streets.
The streets are active with the usual flock heading towards the dock for trade. Languages and species you do not recognize flow in the opposite direction.
The breeze chills towards the Western Egress; it is only the start of this machina. The crystal skies shimmer violet for now.
You don't find anything of value on your excursion, but the distance from your abode gives you perspective.`
}

class ExploreGeneric2 extends Explore {
    content = ``
}

class ExploreFindAnother extends Explore {
    content = `"You are not the last."
<i>What?</i>
Frozen in place. Lightheaded. Is this the shortest sentence to bring on tears? Perhaps not.
"Come back some time."
Dozens of failure conditions run through your mind. A boundless weight now rests upon your soul.
This could define the rest of your life.`
}

class ExploreMeetAnother extends Explore {
    content = `They're familiar.
When you describe the MEMORIES OF HIM, they
Slowly, the days start to become distinct from one another again.`;
}
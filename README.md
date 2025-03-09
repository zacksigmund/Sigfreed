# Sigfreed

## A free software library with no ads, no sign-in, no nonsense

Are you tired of your favorite apps slowly filling with feature bloat, video ads, subscription
services, required logins, and other user-hostile monetization schemes? Sigfreed is the solution. We
will never do any of that stuff. I've got a day job. This is just for the good of the internet. The
most you'll see is an unobtrusive ko-fi link someday if you'd like to support my work.

As a software engineer, I've long had this "I'll just write my own app, but with blackjack, and
hookers." thought, but it never came to anything. Until I found out about
[Picotron](https://www.lexaloffle.com/picotron.php). I was instantly hooked. It harkened back to the
days when computers and the internet were simpler and you could get legitimately free software. It
was very cozy. This project admittedly took a lot of influence from that, but they have very
different goals and are not trying to compete. You should check them out as well.

My main goals:

-   **Free forever.** Not knocking people who charge for things--everyone's gotta make a living. But
    I've got that covered, and everyone needs apps, and things have gotten out of hand on that
    front.
-   **Simple.** I'm not saying I won't continue to add features as needed. But I won't keep tweaking
    things into an unusable mess. ~80% of needs for ~80% of users. If you need obscure things or
    have unique workflows, you're probably better off with other apps.
-   **Cozy.** This is the main part I borrowed from Picotron. I realized that a virtual desktop
    environment and retro/nostalgic graphics were a good way to both both bundle a suite of apps and
    set them apart. Expect blocky icons and chonky buttons. The sizing is also a good incentive to
    keep things simple.
-   **Open technologies.** This is all vanilla JS, CSS, and HTML. Your data is stored in local
    storage. There are no frameworks. There's no package manager. There's no build. You simply have
    to run it as a web server for the JS modules to work properly. There's nothing wrong with using
    someone else's code to make things easier on yourself. But you also put your fate in their
    hands. Which is part of the cause of some of the above issues. And it bloats your bundle size. I
    only use baseline-supported browser features. That said, I do target more modern features for a
    better experience, so you may have to update your browser if you haven't in a while.
-   **Closed platform.** I'm taking more of a Linus Torvalds approach here. It's not that I think I
    know better than you or that you're not a better developer than me. But open development leads
    to too many cooks, competing priorities, inconsistencies, and many other issues. Plus I don't
    have to lock on my API contract or make sure you can read my code ;) If you're really interested
    in helping, please reach out to me first before you go to the trouble of doing any work.
-   **Accessible.** Emphasis on goal here. I have some experience with this but I'm not an expert,
    and I don't have the power of an organization to test everything. And I'm only just chipping
    away at the features themselves. But I plan to gradually comb through everything and use
    reusable components so that any changes can benefit the whole suite. And I'm happy to respond to
    issues on this front!

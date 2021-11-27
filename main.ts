// Made for SeaJam by cfp

namespace SpriteKind {
    export const PreFood = SpriteKind.create()
    export const Check = SpriteKind.create()
}

game.splash("SeaJam", "Made by cfp")

scene.setBackgroundColor(9)
info.setLife(3)
info.setScore(0)

let playerSprite = sprites.create(assets.image`cursor`, SpriteKind.Player)
playerSprite.z = 100
controller.moveSprite(playerSprite)
playerSprite.setStayInScreen(true)

let trash: Sprite[] = []
let trashAmount = 1

trash.push(sprites.create(assets.image`smallBurger`, SpriteKind.Food))

for (let i = 0; i < 3; i++) { // SO YOU HAVE TO USE THIS WEIRD `` SYNTAX? OH MY GOD
    let seaweed = sprites.create(assets.image`seaweed0`, SpriteKind.Enemy)
    seaweed.x = randint(5, 155)
    seaweed.y = scene.screenHeight() - 24
    let seaweedheight = randint(10, 30)
    if (seaweedheight > 20) {
        seaweed.setImage(assets.image`seaweed1`)
    } else if (seaweedheight > 10) {
        seaweed.setImage(assets.image`seaweed2`)
    }
}

for (let i = 0; i < 3; i++) {
    let seaweed = sprites.create(assets.image`mediumOceanRock`, SpriteKind.Enemy)
    seaweed.x = randint(5, 155)
    seaweed.y = scene.screenHeight() - 5
}

let speed = 100

// This only created sharks, now I added other fish too and I am too lazy to rename the function
function createShark() {
    speed += 10
    console.log("Creating shark")
    let fish = randint(0, 2)
    let shark = sprites.create(assets.image`error`, SpriteKind.Enemy)
    let leftOrRight = randint(0, 1)
    if(fish == 0) {
        if (leftOrRight == 0) {
            animation.runImageAnimation(
                shark,
                assets.animation`sharkLeft`,
                speed,
                true
            )
            shark.x = scene.screenWidth()
        } else if (leftOrRight == 1) {
            animation.runImageAnimation(
                shark,
                assets.animation`sharkRight`,
                speed,
                true
            )
            shark.x = 0
        }
    } else if (fish == 1) {
        if (leftOrRight == 0) {
            animation.runImageAnimation(
                shark,
                assets.animation`angelFishLeft`,
                speed,
                true
            )
            shark.x = scene.screenWidth()
        } else if (leftOrRight == 1) {
            animation.runImageAnimation(
                shark,
                assets.animation`angelFishRight`,
                speed,
                true
            )
            shark.x = 0
        }
    } else if (fish == 2) {
        if (leftOrRight == 0) {
            animation.runImageAnimation(
                shark,
                assets.animation`clownFishLeft`,
                speed,
                true
            )
            shark.x = scene.screenWidth()
        } else if (leftOrRight == 1) {
            animation.runImageAnimation(
                shark,
                assets.animation`clownFishRight`,
                speed,
                true
            )
            shark.x = 0
        }
    }
    shark.y = randint(0, scene.screenHeight())

    game.onUpdateInterval(speed / 10, function () {
        if (leftOrRight == 0) {
            shark.x -= 1
            if (shark.x < 0) {
                shark.x = scene.screenWidth()
                shark.y = randint(0, scene.screenHeight())
            }
        } else {
            shark.x += 1
            if (shark.x > scene.screenWidth()) {
                shark.x = 0
                shark.y = randint(0, scene.screenHeight())
            }
        }
    })
}

function spawnFood() {
    let food = randint(0, 11)
    let item = sprites.create(assets.image`error`, SpriteKind.PreFood)
    if (food == 0) {
        item.setImage(assets.image`smallBurger`)
    } else if (food == 1) {
        item.setImage(assets.image`smallApple`)
    } else if (food == 2) {
        item.setImage(assets.image`smallLemon`)
    } else if (food == 3) {
        item.setImage(assets.image`smallDrumstick`)
    } else if (food == 4) {
        item.setImage(assets.image`smallHam`)
    } else if (food == 5) {
        item.setImage(assets.image`smallPizza`)
    } else if (food == 6) {
        item.setImage(assets.image`smallDonut`)
    } else if (food == 7) {
        item.setImage(assets.image`smallCake`)
    } else if (food == 8) {
        item.setImage(assets.image`smallIceCream`)
    } else if (food == 9) {
        item.setImage(assets.image`smallStrawberry`)
    } else if (food == 10) {
        item.setImage(assets.image`smallCherries`)
    } else if (food == 11) {
        item.setImage(assets.image`smallTaco`)
    }
    item.x = randint(0, scene.screenWidth() - 50)
    item.y = randint(0, scene.screenHeight())
    trash.push(item)
    basic.pause(50)
    item.setKind(SpriteKind.Food)
}

createShark()
spawnFood()

basic.forever(function() {
    if(trash.length == 0) {
        trashAmount += 2
        if(trashAmount > 100) trashAmount = 100
        if(trashAmount < 15) createShark()
        for(let i = 0; i < trashAmount; i++) {
            spawnFood()
        }
    }
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
	let check = sprites.create(assets.image`cursor`, SpriteKind.Food)
    check.x = playerSprite.x
    check.y = playerSprite.y
    check.setKind(SpriteKind.Check)
    basic.pause(50)
    check.destroy()
})

sprites.onOverlap(SpriteKind.Check, SpriteKind.Food, function(sprite: Sprite, otherSprite: Sprite) {
    sprite.destroy()
    otherSprite.destroy()
    info.changeScoreBy(1)
    trash.removeElement(otherSprite)
})

sprites.onOverlap(SpriteKind.Check, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    sprite.destroy()
    info.changeLifeBy(-1)
    music.smallCrash.play()
    let projectile = sprites.createProjectileFromSprite(assets.image`error`, otherSprite, 0, 0)
    animation.runImageAnimation(
        projectile,
        assets.animation`heart`,
        100,
        false
    )
    basic.pause(500)
    projectile.destroy()
})

sprites.onOverlap(SpriteKind.PreFood, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    sprite.destroy()
    trash.removeElement(sprite)
})
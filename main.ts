// Made for SeaJam by cfp

namespace SpriteKind {
    export const PreFood = SpriteKind.create()
}

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

for(let i = 0; i < 3; i++) { // SO YOU HAVE TO USE THIS WEIRD `` SYNTAX? OH MY GOD
    let seaweed = sprites.create(assets.image`seaweed0`, SpriteKind.Enemy)
    seaweed.x = randint(5, 155)
    seaweed.y = scene.screenHeight() - 24
    let seaweedheight = randint(10, 30)
    if(seaweedheight > 20) {
        seaweed.setImage(assets.image`seaweed1`)
    } else if(seaweedheight > 10) {
        seaweed.setImage(assets.image`seaweed2`)
    }
}

function createShark() {
    console.log("Creating shark")
    let shark = sprites.create(assets.image`error`, SpriteKind.Enemy)
    let leftOrRight = randint(0, 1)
    if(leftOrRight == 0) {
        animation.runImageAnimation(
            shark,
            assets.animation`sharkLeft`,
            100,
            true
        )
        shark.x = scene.screenWidth()
    } else if(leftOrRight == 1) {
        animation.runImageAnimation(
            shark,
            assets.animation`sharkRight`,
            100,
            true
        )
        shark.x = 0
    }
    shark.y = randint(0, scene.screenHeight())

    game.onUpdateInterval(10, function() {
        if(leftOrRight == 0) {
            shark.x -= 1
            if(shark.x < 0) {
                shark.x = scene.screenWidth()
                shark.y = randint(0, scene.screenHeight())
            }
        } else {
            shark.x += 1
            if(shark.x > scene.screenWidth()) {
                shark.x = 0
                shark.y = randint(0, scene.screenHeight())
            }
        }
    })
}
createShark()

basic.forever(function() {
    if(trash.length == 0) {
        trashAmount += 2
        if(trashAmount > 100) trashAmount = 100
        if(trashAmount < 10) createShark()
        for(let i = 0; i < trashAmount; i++) {
            let item = sprites.create(assets.image`smallBurger`, SpriteKind.PreFood)
            item.x = randint(0, scene.screenWidth() - 50)
            item.y = randint(0, scene.screenHeight())
            trash.push(item)
            basic.pause(100)
            item.setKind(SpriteKind.Food)
        }
    }
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
	let check = sprites.create(assets.image`cursor`, SpriteKind.Food)
    check.x = playerSprite.x
    check.y = playerSprite.y
    check.setKind(SpriteKind.Projectile)
    basic.pause(100)
    check.destroy()
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Food, function(sprite: Sprite, otherSprite: Sprite) {
    sprite.destroy()
    otherSprite.destroy()
    info.changeScoreBy(1)
    trash.removeElement(otherSprite)
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    sprite.destroy()
    info.changeLifeBy(-1)
    music.smallCrash.play()
})

sprites.onOverlap(SpriteKind.PreFood, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
    sprite.destroy()
    trash.removeElement(sprite)
})
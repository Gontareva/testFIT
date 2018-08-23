let _ = require('underscore');
let Comment = require('../models/comment');

/*
 * GET /book маршрут для получения списка всех книг.
 */
function getComments(req, res) {
    let query = Comment.find(_.pick(req.query,"text","name","email","createdAt"));
    query.exec((err, comments) => {
        if(err) {
            res.status(400);
            res.send(err);
        }
        //если нет ошибок, отправить клиенту
        res.json(comments);
    });
}

/*
 * POST /book для создания новой книги.
 */
function postComment(req, res) {
    var newComment = new Comment(_.pick(req.body,"text","name","email","createdAt"));
    newComment.save((err,comment) => {
        if(err) {
            res.status(206);
            res.send(err);
        }
        else { //Если нет ошибок, отправить ответ клиенту
            res.json({message: "Comment successfully added!", comment});
        }
    });
}

//экспортируем все функции
module.exports = { getComments, postComment};

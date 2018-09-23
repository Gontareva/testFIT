let _ = require('underscore');
let Comments = require('../models/comments');
let moment = require('moment');


function compare(a, b, mode) {
    return (a - b) * (mode > 0 ? 1 : -1);
}

/*
 * GET /book маршрут для получения списка всех книг.
 */
function getComments(req, res) {
    let query = Comments.find(_.pick(req.query, "text", "name", "email", "createdAt")).sort({"text.length": 1});

    query.exec((err, comments) => {
        if (err) {
            res.status(400);
            res.send(err);
        }

        comments = _.chain(comments)
            .filter((comment) => {
                req.query.createDateStart = req.query.createDateStart || 0;
                req.query.createDateEnd = req.query.createDateEnd || _.now();
                return moment(comment.createdAt).isSameOrBefore(req.query.createDateEnd) && moment(comment.createdAt).isSameOrAfter(req.query.createDateStart);
            })
            .filter((comment) => {
                if (req.query.findText)
                    return comment.text.indexOf(req.query.findText) + 1;
                else return true;
            })
            .value();

        if (req.query.sortByDate && req.query.sortByLength) {
            comments.sort((comm1, comm2) => {
                if (moment(comm1.createdAt) - moment(comm2.createdAt) === 0) {
                    return compare(comm1.text.length, comm2.text.length, req.query.sortByLength);
                }
                else {
                    return compare(moment(comm1.createdAt), moment(comm2.createdAt), req.query.sortByDate);
                }
            })
        }
        else if (req.query.sortByDate) {
            comments.sort((comm1, comm2) => {
                return compare(moment(comm1.createdAt), moment(comm2.createdAt), req.query.sortByDate);
            })
        }
        else if (req.query.sortByLength) {
            comments.sort((comm1, comm2) => {
                return compare(comm1.text.length, comm2.text.length, req.query.sortByLength);
            })
        }

        res.json(comments);
    });
}

/*
 * POST /book для создания новой книги.
 */
function postComment(req, res) {
    var newComment = new Comments(_.pick(req.body, "text", "name", "email", "createdAt"));
    newComment.save((err, comment) => {
        if (err) {
            res.status(206);
            res.send(err);
        }
        else { //Если нет ошибок, отправить ответ клиенту
            res.json({message: "Comment successfully added!", comment});
        }
    });
}

//экспортируем все функции
module.exports = {getComments, postComment};

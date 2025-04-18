let { Grade, Student, Course } = require('../model');
const { getPaginatedResults } = require('../utils/paginationUtils');
function getAll(req, res) {
    Grade.find()
        .populate('student')
        .populate('course')
        .then((grades) => {
            res.send(grades);
        }).catch((err) => {
        res.send(err);
    });
}
async function getPagination(req, res) {
    try {
        const data = await getPaginatedResults(Grade, req, ['student', 'course']);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

function create(req, res) {
    let grade = new Grade();

    grade.student = req.body.student;
    grade.course = req.body.course;
    grade.grade = req.body.grade;
    grade.date = req.body.date;

    grade.save()
        .then((grade) => {
                res.json({message: `grade saved with id ${grade.id}!`});
            }
        ).catch((err) => {
        console.log(err);
        res.status(400).send('cant post grade ', err.message);
    });
}

function update(req, res) {
    const id = req.params.id

    Grade.findByIdAndUpdate(id, {...req.body})
        .then(() => {
            res.json({message: `grade updated with id ${id}`})
        })
        .catch((err) => {
            res.send(`can't update grade `, err)
        })
}

function deleteGrade(req, res) {
    const id = req.params.id

    Grade.deleteOne({_id: id})
        .then(() => {
            res.json({message: `grade deleted with id ${id}`})
        })
        .catch((err) => {
            res.send(`can't delete grade `, err)
        })
}

function getById(req, res) {
    const id = req.params.id;

    Grade.findById(id)
        .populate('student')
        .populate('course')
        .then((grade) => {
            if (!grade) {
                return res.status(404).send('Grade not found');
            }
            res.send(grade);
        })
        .catch((err) => {
            res.status(500).send(`Error retrieving grade: ${err.message}`);
        });
}

module.exports = {getAll,getPagination, create, update, deleteGrade, getById};

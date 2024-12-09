const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method);
//     console.log('Path:  ', request.path);
//     console.log('Body:  ', request.body);
//     console.log('---');
//     next();
// };
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
// app.use(requestLogger);

// app.use(morgan('tiny'));

morgan.token('reqData', (request, response) => {
    return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'));

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-1234567",
        "id": "1"
    },
    {
        "name": "Bianca Beasley",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Cory Cabana",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Dan Dubosky",
        "number": "39-23-6423122",
        "id": "4"
    },
    {
        "name": "Egor Eggin",
        "number": "52852374",
        "id": "5"
    },
    {
        "name": "Fedor Feddin",
        "number": "432813276",
        "id": "6"
    },
    {
        "name": "Gary Goober",
        "number": "432813275",
        "id": "7"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook<h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/info', (request, response) => {
    const amount = `Phonebook has info for ${persons.length} people`;
    const timeNow = new Date();

    response.send(`<p>${amount}<p><p>${timeNow}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    return String(Math.floor(Math.random() * 10000));
}

app.post('/api/persons/', (request, response) => {
    const body = request.body;

    if (!body.name) {
        response.status(400).json({
            error: 'name missing'
        });
    };

    if (!body.number) {
        response.status(400).json({
            error: 'number missing'
        });
    };

    if (persons.some(person => person.name.includes(body.name))) {
        response.status(400).json({
            error: 'name must be unique'
        });
    };

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    persons = persons.concat(person);

    response.json(person);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send(
        { error: 'unknown endpoint' }
    );
};

app.use(unknownEndpoint);

// const PORT = 3004;
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
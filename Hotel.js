const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const app = express();
app.use(bodyParser.json());

// Mock database
let roomTypes = [];
let rooms = [];

// POST endpoint for storing room type
app.post('/api/v1/rooms-types', (req, res) => {
    const { name } = req.body;
    const roomType = {
        _id: new ObjectId(),
        name: name
    };
    roomTypes.push(roomType);
    res.status(201).json(roomType);
});

// GET endpoint for fetching all room types
app.get('/api/v1/rooms-types', (req, res) => {
    res.json(roomTypes);
});

// POST endpoint for storing room
app.post('/api/v1/rooms', (req, res) => {
    const { name, roomType, price } = req.body;
    const room = {
        _id: new ObjectId(),
        name: name,
        roomType: roomType,
        price: price
    };
    rooms.push(room);
    res.status(201).json(room);
});

// GET endpoint for fetching rooms with optional filters
app.get('/api/v1/rooms', (req, res) => {
    let filteredRooms = rooms;
    if (req.query.search) {
        filteredRooms = filteredRooms.filter(room => room.name.includes(req.query.search));
    }
    if (req.query.roomType) {
        filteredRooms = filteredRooms.filter(room => room.roomType.toString() === req.query.roomType);
    }
    if (req.query.minPrice) {
        filteredRooms = filteredRooms.filter(room => room.price >= parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
        filteredRooms = filteredRooms.filter(room => room.price <= maxPrice && room.price >= minPrice);
    }
    res.json(filteredRooms);
});

// PATCH endpoint for editing a room
app.patch('/api/v1/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const { name, roomType, price } = req.body;
    const roomIndex = rooms.findIndex(room => room._id.toString() === roomId);
    if (roomIndex !== -1) {
        if (name) rooms[roomIndex].name = name;
        if (roomType) rooms[roomIndex].roomType = roomType;
        if (price) rooms[roomIndex].price = price;
        res.json(rooms[roomIndex]);
    } else {
        res.status(404).json({ message: 'Room not found' });
    }
});

// DELETE endpoint for deleting a room
app.delete('/api/v1/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const roomIndex = rooms.findIndex(room => room._id.toString() === roomId);
    if (roomIndex !== -1) {
        rooms.splice(roomIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Room not found' });
    }
});

// GET endpoint for fetching a room by id
app.get('/api/v1/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const room = rooms.find(room => room._id.toString() === roomId);
    if (room) {
        res.json(room);
    } else {
        res.status(404).json({ message: 'Room not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

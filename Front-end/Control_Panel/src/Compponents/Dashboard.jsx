import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Modal,
    Paper,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

// Define a custom card style
const StyledCard = styled(Card)`
  height: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

// Modal style
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Dashboard = () => {
    const [data, setData] = useState({
        totalUsers: 0,
        totalEmails: 0,
        recentActivities: [],
        usersDetails: [],
        emailsDetails: [],
    });

    const [formData, setFormData] = useState({ username: '', email: '', password: '', _id: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);  // State to control the confirmation dialog
    const [userToDelete, setUserToDelete] = useState(null);  // Store the user to delete

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/getDashboardData');
                console.log('Fetched Data:', response.data);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    // Fetch user details
    const fetchUserDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/getAllUsers');
            if (response.data) {
                setData((prevData) => ({
                    ...prevData,
                    usersDetails: response.data,
                }));
                setOpenUserModal(true);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    // Add or Update User
    const handleSubmitUser = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Frontend Validation
        if (!formData.username || !formData.email || !formData.password) {
            console.error('Username, Email, and Password are required');
            return; // Exit if validation fails
        }

        try {
            const url = isEditing
                ? `http://localhost:5000/api/users/updateUser/${formData._id}`
                : `http://localhost:5000/api/users/addUser`;

            const method = isEditing ? 'put' : 'post';

            const response = await axios[method](url, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200 || response.status === 201) {
                console.log('User successfully added/updated:', response.data);

                fetchUserDetails(); // Refresh user list
                setOpenAddUserModal(false);
                setFormData({ username: '', email: '', password: '', _id: '' });
                setIsEditing(false);
            } else {
                console.error('Unexpected response:', response.data);
            }
        } catch (error) {
            console.error('Error submitting user:', error.response?.data || error.message);
        }
    };

    // Delete User
    const handleDeleteUser = async () => {
        try {
            if (userToDelete) {
                await axios.delete(`http://localhost:5000/api/users/deleteUser/${userToDelete._id}`);
                fetchUserDetails(); // Refresh user list
                setOpenConfirmDelete(false); // Close the confirmation dialog
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Open Add User Modal
    const handleOpenAddUserModal = () => {
        setFormData({ username: '', email: '', password: '', _id: '' });
        setIsEditing(false);
        setOpenAddUserModal(true);
    };

    // Edit User
    const handleEditUser = (user) => {
        setFormData(user);
        setIsEditing(true);
        setOpenAddUserModal(true);
    };

    // Toggle password visibility
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Open confirmation dialog
    const handleOpenConfirmDelete = (user) => {
        setUserToDelete(user);
        setOpenConfirmDelete(true);
    };

    // Close confirmation dialog
    const handleCloseConfirmDelete = () => {
        setUserToDelete(null);
        setOpenConfirmDelete(false);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h3" gutterBottom>
                Admin Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* Total Users */}
                <Grid item xs={12} sm={6} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h5" color="textPrimary">
                                Total Users
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                {data.totalUsers}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={fetchUserDetails}>
                                View Details
                            </Button>
                        </CardActions>
                    </StyledCard>
                </Grid>

                {/* Total Emails */}
                <Grid item xs={12} sm={6} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h5" color="textPrimary">
                                Total Emails
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                {data.totalEmails}
                            </Typography>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* User Details Modal */}
            <Modal
                open={openUserModal}
                onClose={() => setOpenUserModal(false)}
                aria-labelledby="user-details-modal"
            >
                <Paper sx={modalStyle}>
                    <Typography variant="h5">User Details</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenAddUserModal}
                    >
                        Add New User
                    </Button>
                    {Array.isArray(data.usersDetails) && data.usersDetails.length > 0 ? (
                        data.usersDetails.map((user, index) => (
                            <Box key={index} sx={{ margin: '8px 0' }}>
                                <Typography>{`Name: ${user.username}, Email: ${user.email}`}</Typography>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditUser(user)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleOpenConfirmDelete(user)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        ))
                    ) : (
                        <Typography>No user details available.</Typography>
                    )}
                </Paper>
            </Modal>

            {/* Add or Edit User Modal */}
            <Modal
                open={openAddUserModal}
                onClose={() => setOpenAddUserModal(false)}
                aria-labelledby="add-user-modal"
            >
                <Paper sx={modalStyle}>
                    <Typography variant="h5">
                        {isEditing ? 'Edit User' : 'Add New User'}
                    </Typography>
                    <form onSubmit={handleSubmitUser}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}  // Toggle between 'text' and 'password'
                            value={formData.password || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            margin="normal"
                        />
                        <Button
                            type="button"
                            onClick={handleTogglePassword}  // Toggle password visibility
                            variant="text"
                            sx={{ marginTop: 1 }}
                        >
                            {showPassword ? 'Hide Password' : 'Show Password'}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 }}
                        >
                            Submit
                        </Button>
                    </form>
                </Paper>
            </Modal>

            {/* Confirmation Dialog for Delete */}
            <Dialog
                open={openConfirmDelete}
                onClose={handleCloseConfirmDelete}
                aria-labelledby="confirm-delete-dialog"
            >
                <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;

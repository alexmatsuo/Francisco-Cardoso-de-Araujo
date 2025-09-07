// scripts/create-user.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
      console.log('Usage: node create-user.js <username> <password>');
      process.exit(1);
    }

    console.log('Original password:', password);

    // Hash the password with debugging
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    console.log('Hash length:', hashedPassword.length);

    // Verify the hash works
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Hash verification test:', isValid);

    if (!isValid) {
      throw new Error('Hash verification failed!');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log('User already exists! Updating password...');
      
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { username },
        data: { password: hashedPassword }
      });
      
      console.log('User password updated successfully:', { id: updatedUser.id, username: updatedUser.username });
      return;
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log('User created successfully:', { id: user.id, username: user.username });
    
    // Verify the user was created with hashed password
    const createdUser = await prisma.user.findUnique({
      where: { username }
    });
    
    console.log('Stored password starts with:', createdUser.password.substring(0, 10) + '...');
    console.log('Password is hashed:', createdUser.password.startsWith('$2'));

  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
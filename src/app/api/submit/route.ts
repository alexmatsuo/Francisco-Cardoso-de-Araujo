import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Here you can process the form data
    // For now, we'll just log it and return success
    console.log('Form submission:', { name, email, subject, message });

    // You can add email sending logic here using your preferred method
    // (nodemailer, SendGrid, Resend, etc.)

    // Redirect to a thank you page or back to contact with success message
    return NextResponse.redirect(new URL('/contact?success=true', request.url));

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.redirect(new URL('/contact?error=true', request.url));
  }
}
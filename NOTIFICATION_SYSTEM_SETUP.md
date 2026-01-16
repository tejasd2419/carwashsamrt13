# SparkleWash Notification System Setup Guide

## Overview

Your notification system is fully integrated with:
- **Email Notifications** - Automated booking confirmations, reminders, and updates
- **Database Tracking** - All notifications logged in the database
- **User Preferences** - Users can control notification settings
- **Email Templates** - Professional HTML templates for all notification types

## Environment Variables Required

### For Gmail (Recommended)

\`\`\`env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com  # Optional
EMAIL_ENABLED=true
\`\`\`

**Getting Gmail App Password:**
1. Enable 2-Factor Authentication in Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Use this in `EMAIL_PASSWORD` (remove spaces)

### For Generic SMTP

\`\`\`env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASSWORD=your-password
EMAIL_FROM=sender@example.com
EMAIL_ENABLED=true
\`\`\`

## Notification Types Supported

1. **booking_created** - When user creates a booking
2. **booking_confirmed** - When admin confirms a booking
3. **booking_reminder** - 24 hours before scheduled booking
4. **booking_completed** - After service is completed
5. **booking_cancelled** - When booking is cancelled

## User Preferences

Users can control notifications through:
- Email notifications (enabled/disabled)
- SMS notifications (framework ready)
- Booking confirmation alerts
- Booking reminders (24 hours before)
- Booking updates
- Custom reminder hours before booking

## Database Schema

### notifications table
- `id` - Unique notification ID
- `user_id` - User receiving notification
- `booking_id` - Related booking
- `type` - Notification type (see above)
- `title` - Notification title
- `message` - Notification message
- `status` - Current status (pending, sent, failed)
- `email_sent` - Whether email was sent
- `read_at` - When user read in-app notification
- `created_at` - Creation timestamp

### notification_preferences table
- `user_id` - User ID
- `email_notifications` - Boolean (1/0)
- `sms_notifications` - Boolean (1/0)
- `booking_confirmation` - Boolean (1/0)
- `booking_reminder` - Boolean (1/0)
- `booking_updates` - Boolean (1/0)
- `reminder_hours_before` - Hours before booking to send reminder

### notification_history table
- `notification_id` - Related notification
- `channel` - Delivery channel (email, sms, in-app)
- `recipient` - Recipient address/ID
- `delivery_status` - sent/failed
- `error_message` - If failed
- `sent_at` - Delivery timestamp

## API Endpoints

### Get User Notifications
\`\`\`
GET /api/notifications
Headers: Authorization: Bearer {token}
Query: limit=20&offset=0
\`\`\`

### Mark as Read
\`\`\`
PATCH /api/notifications/:id/read
Headers: Authorization: Bearer {token}
\`\`\`

### Get Preferences
\`\`\`
GET /api/notifications/preferences
Headers: Authorization: Bearer {token}
\`\`\`

### Update Preferences
\`\`\`
PUT /api/notifications/preferences
Headers: Authorization: Bearer {token}
Body: {
  email_notifications: 1,
  booking_confirmation: 1,
  booking_reminder: 1,
  booking_updates: 1,
  reminder_hours_before: 24
}
\`\`\`

## Testing the System

### Run the Test Script
\`\`\`bash
cd backend
node scripts/test-notification-system.js
\`\`\`

This will:
1. Verify email configuration
2. Test email transporter connection
3. Send a test email to `tejasdhamdhere2419@gmail.com`
4. Check database tables
5. Display system status

### Manual Test with Booking

1. Create a new booking in the app
2. Check console logs for notification creation
3. Check your email inbox for booking confirmation
4. Check database for notification records

## Troubleshooting

### Email Not Sending
1. Check environment variables are set correctly
2. Run the test script to verify configuration
3. Check backend console for error messages
4. Verify `EMAIL_ENABLED` is not set to "false"

### Gmail Connection Issues
- Make sure you're using an **App Password**, not your Google password
- Gmail may block "less secure apps" - use App Passwords instead
- Check if 2FA is enabled on your account

### Database Issues
- Run the master database reset script
- Ensure notification tables are created
- Check database migration script has been executed

## Your Test Email

**Email:** tejasdhamdhere2419@gmail.com

All test notifications will be sent to this email address.

## Production Considerations

1. **Security**: Never hardcode email credentials in code
2. **Rate Limiting**: Consider adding rate limits for notification sending
3. **Queue System**: For high volume, use a message queue (Redis, RabbitMQ)
4. **Monitoring**: Log all notification deliveries for debugging
5. **Fallback**: Have a fallback email provider
6. **Templates**: Consider using a template service (SendGrid, Mailgun) for production

## Next Steps

1. Set up your email environment variables
2. Run the test script to verify configuration
3. Create a test booking to see notifications in action
4. Monitor logs and email delivery
5. Customize email templates as needed

export default function handler(req: any, res: any) {
  res.status(200).json({ success: true, message: 'Frontend and backend are connected!' });
} 
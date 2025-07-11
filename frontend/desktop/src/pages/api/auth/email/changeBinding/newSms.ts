import { filterAccessToken } from '@/services/backend/middleware/access';
import { ErrorHandler } from '@/services/backend/middleware/error';
import {
  filterCodeUid,
  filterEmailParams,
  sendNewSmsCodeGuard
} from '@/services/backend/middleware/sms';
import { sendEmailCodeSvc } from '@/services/backend/svc/sms';
import { enableEmailSms } from '@/services/enable';
import { NextApiRequest, NextApiResponse } from 'next';
export default ErrorHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!enableEmailSms()) {
    throw new Error('SMS is not enabled');
  }
  await filterAccessToken(req, res, ({ userUid }) =>
    filterEmailParams(req, res, ({ email }) =>
      filterCodeUid(req, res, ({ uid }) =>
        sendNewSmsCodeGuard({
          codeUid: uid,
          smsId: email,
          smsType: 'email_change_new'
        })(req, res, () => sendEmailCodeSvc(email, 'email_change_new')(res))
      )
    )
  );
});

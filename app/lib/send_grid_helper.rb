# frozen_string_literal: true
require 'sendgrid-ruby'
include SendGrid

class SendGridHelper

  def self.send_email(email)
    from = Email.new(email: email[:from])
    to = Email.new(email: email[:to])
    subject = email[:subject]
    content = Content.new(type: 'text/plain', value: email[:body])
    mail = SendGrid::Mail.new(from, subject, to, content)

    sg = SendGrid::API.new(api_key: Rails.application.config.sendgrid['SENDGRID_API_KEY'])
    response = sg.client.mail._('send').post(request_body: mail.to_json)
    puts response.status_code
    puts response.body
    puts response.headers
  end
end

# frozen_string_literal: true

class CalendarEntry < ApplicationRecord
  belongs_to :klass

  def get_klass_entries
    klass_id = 1
    entries = CalendarEntry.where(klass_id: klass_id).map(&:attributes)
    render status: :ok, json: entries
  end
end

import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input, TextArea } from '../ui/Input'
import { Button } from '../ui/Button'
import type { Shipment } from '../../types'

interface EditShipmentModalProps {
  shipment: Shipment
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Shipment>) => void
}

export function EditShipmentModal({
  shipment,
  isOpen,
  onClose,
  onSave,
}: EditShipmentModalProps) {
  const [formData, setFormData] = useState({
    shipFrom_name:
      shipment.shipFrom_name || shipment.parties?.shipper?.name || '',
    shipTo_name:
      shipment.shipTo_name || shipment.parties?.consignee?.name || '',
    carrier: shipment.carrier || shipment.parties?.carrier?.name || '',
    container_no:
      shipment.container_no || shipment.cargo?.[0]?.container_number || '',
    seal_no: shipment.seal_no || shipment.cargo?.[0]?.seal_number || '',
    items: shipment.items || shipment.cargo?.[0]?.description || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    onSave({
      ...shipment,
      ...formData,
      parties: {
        ...shipment.parties,
        shipper: {
          ...shipment.parties?.shipper,
          name: formData.shipFrom_name,
        },
        consignee: {
          ...shipment.parties?.consignee,
          name: formData.shipTo_name,
        },
        carrier: {
          ...shipment.parties?.carrier,
          name: formData.carrier,
        },
      },
      cargo: [
        {
          ...shipment.cargo?.[0],
          container_number: formData.container_no,
          seal_number: formData.seal_no,
          description: formData.items,
        },
      ],
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Shipment" size="lg">
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="From"
            name="shipFrom_name"
            value={formData.shipFrom_name}
            onChange={handleChange}
            placeholder="Shipper name"
          />
          <Input
            label="To"
            name="shipTo_name"
            value={formData.shipTo_name}
            onChange={handleChange}
            placeholder="Consignee name"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
            placeholder="Carrier name"
          />
          <Input
            label="Container #"
            name="container_no"
            value={formData.container_no}
            onChange={handleChange}
            placeholder="ABCD1234567"
            className="border-blue-200 bg-blue-50"
          />
          <Input
            label="Seal #"
            name="seal_no"
            value={formData.seal_no}
            onChange={handleChange}
            placeholder="Seal number"
            className="border-blue-200 bg-blue-50"
          />
        </div>

        <TextArea
          label="Description"
          name="items"
          value={formData.items}
          onChange={handleChange}
          placeholder="Cargo description"
          rows={4}
        />
      </div>

      <div className="p-4 border-t flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save & Download PDF
        </Button>
      </div>
    </Modal>
  )
}

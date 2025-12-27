'use client'

import React, { useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Textarea from '@/components/Textarea'
import Badge from '@/components/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import Alert from '@/components/Alert'
import Modal from '@/components/Modal'
import Spinner from '@/components/Spinner'
import Tabs from '@/components/Tabs'
import Pagination from '@/components/Pagination'
import EmptyState from '@/components/EmptyState'
import ConfirmDialog from '@/components/ConfirmDialog'
import ProgressBar from '@/components/ProgressBar'
import { SkeletonCard } from '@/components/Skeleton'

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('buttons')
  const [currentPage, setCurrentPage] = useState(1)

  const tabs = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'layout', label: 'Layout' },
  ]

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
        <p className="text-gray-600">ADFLO UI Component Library</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

      {activeTab === 'buttons' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">States</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="default">Default</Badge>
                <Badge variant="clean">Clean</Badge>
                <Badge variant="private">Private</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'inputs' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-w-md">
                <Input label="Email" type="email" placeholder="you@example.com" />
                <Input label="With Error" error="This field is required" />
                <Input label="With Helper" helperText="Enter your email address" />
                
                <Select
                  label="Select Option"
                  options={[
                    { value: '', label: 'Choose...' },
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                  ]}
                />
                
                <Textarea label="Description" rows={4} placeholder="Enter description..." />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert type="success" title="Success">
                  Your action was completed successfully.
                </Alert>
                <Alert type="warning" title="Warning">
                  Please review this information carefully.
                </Alert>
                <Alert type="error" title="Error">
                  An error occurred. Please try again.
                </Alert>
                <Alert type="info" title="Information">
                  Here's some helpful information.
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loading States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
                <SkeletonCard />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Bars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProgressBar value={25} variant="primary" showLabel />
                <ProgressBar value={50} variant="success" showLabel />
                <ProgressBar value={75} variant="warning" showLabel />
                <ProgressBar value={100} variant="danger" showLabel />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modals & Dialogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                  Open Confirm Dialog
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'layout' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hover>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">This is a basic card with hover effect.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Another Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Cards can contain any content.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagination</CardTitle>
            </CardHeader>
            <CardContent>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                }
                title="No items found"
                description="Get started by creating your first item"
                action={{
                  label: 'Create Item',
                  onClick: () => alert('Create clicked'),
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Example */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
        <div className="space-y-4">
          <p className="text-gray-600">This is an example modal dialog.</p>
          <Input label="Name" placeholder="Enter your name" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog Example */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        type="danger"
        onConfirm={() => {
          setConfirmOpen(false)
          alert('Confirmed!')
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

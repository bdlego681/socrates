import { Component, OnInit, inject, ElementRef, HostListener, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe],
  template: `
    <div class="page-container">
      <div class="users-layout">
        <!-- Invite Form Column -->
        <div class="layout-side">
          <div class="card invite-card">
            <h2 class="card-title">Invite User</h2>
            <form (ngSubmit)="invite()" #form="ngForm" class="invite-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <div class="input-with-icon">
                  <span class="material-symbols-outlined icon">mail</span>
                  <input type="email" id="email" name="email" [(ngModel)]="email" required class="form-control" placeholder="user@example.com" />
                </div>
              </div>
              <div class="form-group">
                <label>Role</label>
                
                <!-- Custom Dropdown -->
                <div class="custom-select-wrapper" [class.open]="dropdownOpen" (click)="toggleDropdown($event)">
                  <div class="custom-select-trigger">
                    <span class="material-symbols-outlined icon">badge</span>
                    <span class="selected-text">{{ selectedRoleName }}</span>
                    <span class="material-symbols-outlined chevron">expand_more</span>
                  </div>
                  <div class="custom-options" *ngIf="dropdownOpen">
                    <div class="custom-option" 
                         *ngFor="let role of roles()" 
                         (click)="selectRole(role, $event)"
                         [class.selected]="role.RoleID === roleId">
                      {{ role.RoleName }}
                      <span class="material-symbols-outlined check" *ngIf="role.RoleID === roleId">check</span>
                    </div>
                  </div>
                </div>
                <!-- Hidden input for form validation binding if needed -->
                <input type="hidden" name="roleId" [(ngModel)]="roleId" required />
              </div>
              
              <button type="submit" [disabled]="form.invalid || loading" class="btn btn-primary w-100 mt-4">
                <span class="material-symbols-outlined mr-2">send</span>
                {{ loading ? 'Inviting...' : 'Send Invite' }}
              </button>
            </form>

            <div *ngIf="error" class="alert alert-error mt-4">
              {{ error }}
            </div>
          </div>
        </div>

        <!-- Users Table Column -->
        <div class="layout-main">
          <div class="card table-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
              <h2 class="card-title" style="margin-bottom: 0;">Existing Users</h2>
              <div class="toolbar-search" style="position: relative; width: 300px;">
                <span class="material-symbols-outlined" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 20px;">search</span>
                <input type="text" placeholder="Search by email or role..." [ngModel]="searchQuery()" (ngModelChange)="onSearchChange($event)" style="width: 100%; padding: 8px 12px 8px 36px; border: 1px solid var(--border); border-radius: var(--radius-md); background: transparent; color: var(--text-primary); outline: none;">
              </div>
            </div>
            
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of paginatedUsers()">
                    <td>
                      <div class="user-email-cell">
                        <span style="font-weight: 500;">{{ user.username || '—' }}</span>
                      </div>
                    </td>
                    <td class="text-secondary">{{ user.Email }}</td>
                    <td><span class="badge">{{ user.RoleName }}</span></td>
                    <td>
                      <span class="status-badge" [class.active]="user.AccountStatus === 'Active'">
                        {{ user.AccountStatus }}
                      </span>
                    </td>
                    <td class="text-muted">{{ user.CreatedAt | date:'MMM d, y, h:mm a' }}</td>
                    <td class="text-right">
                      <div class="action-buttons">
                        <button class="btn-icon" title="Edit Role" (click)="editUser(user)">
                          <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-icon danger" title="Delete User" (click)="deleteUser(user)">
                          <span class="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="filteredUsers().length === 0">
                    <td colspan="5" class="text-center py-8 text-muted">
                      <span class="material-symbols-outlined empty-icon">group_off</span>
                      <p>No users found matching your search.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="filteredUsers().length > 0" style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-4); margin-top: var(--space-4); border-top: 1px solid var(--border);">
              <div class="text-secondary" style="font-size: var(--text-sm);">
                Showing {{ startRecord() }} to {{ endRecord() }} of {{ filteredUsers().length }} results
              </div>
              <div style="display: flex; gap: var(--space-2);">
                <button class="btn btn-secondary" [disabled]="currentPage() === 1" (click)="prevPage()">Previous</button>
                <button class="btn btn-secondary" [disabled]="currentPage() === totalPages()" (click)="nextPage()">Next</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal-overlay" *ngIf="userToDelete">
      <div class="modal-card">
        <h3 class="modal-title">Delete User</h3>
        <p class="modal-body">Are you sure you want to delete <strong>{{ userToDelete.Email }}</strong>? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="userToDelete = null">Cancel</button>
          <button class="btn btn-primary danger-btn" (click)="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" *ngIf="userToEdit">
      <div class="modal-card">
        <h3 class="modal-title">Edit Role for {{ userToEdit.Email }}</h3>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Select New Role</label>
            <div class="custom-select-wrapper" [class.open]="editDropdownOpen" (click)="toggleEditDropdown($event)">
              <div class="custom-select-trigger">
                <span class="material-symbols-outlined icon">badge</span>
                <span class="selected-text">{{ getEditRoleName() }}</span>
                <span class="material-symbols-outlined chevron">expand_more</span>
              </div>
              <div class="custom-options" *ngIf="editDropdownOpen">
                <div class="custom-option" 
                     *ngFor="let role of roles()" 
                     (click)="selectEditRole(role, $event)"
                     [class.selected]="role.RoleID === editRoleId">
                  {{ role.RoleName }}
                  <span class="material-symbols-outlined check" *ngIf="role.RoleID === editRoleId">check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="closeEditModal()">Cancel</button>
          <button class="btn btn-primary" (click)="confirmEdit()">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Invite Success Modal -->
    <div class="modal-overlay" *ngIf="inviteUrl">
      <div class="modal-card">
        <h3 class="modal-title">User Invited Successfully</h3>
        <p class="modal-body" style="margin-bottom: var(--space-4);">Share this single-use link with the user to allow them to complete their account setup.</p>
        
        <div class="copy-box">
          <input type="text" readonly [value]="inviteUrl" class="form-control" #inviteLinkInput>
          <button class="btn btn-primary btn-copy" (click)="copyLink()" [class.copied]="copied">
            <span class="material-symbols-outlined">{{ copied ? 'check' : 'content_copy' }}</span>
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>

        <div class="modal-actions mt-4">
          <button class="btn btn-secondary w-100" (click)="closeInviteModal()">Done</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--space-6) var(--space-8);
      max-width: 100%;
      height: 100%;
    }
    
    .users-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: var(--space-6);
      align-items: start;
    }

    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow-sm);
    }
    .card-title {
      font-size: 18px;
      margin-bottom: var(--space-5);
      font-weight: 600;
    }
    
    .mt-4 { margin-top: var(--space-4); }
    .w-100 { width: 100%; }
    .mr-2 { margin-right: var(--space-2); }
    .text-right { text-align: right; }
    
    /* Input with Icon */
    .input-with-icon {
      position: relative;
    }
    .input-with-icon .icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 20px;
    }
    .input-with-icon input {
      padding-left: 40px;
    }
    
    /* Custom Select */
    .custom-select-wrapper {
      position: relative;
      user-select: none;
    }
    .custom-select-trigger {
      display: flex;
      align-items: center;
      width: 100%;
      height: var(--control-h);
      padding: 0 var(--space-3);
      font-family: inherit;
      font-size: var(--text-base);
      color: var(--text-primary);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: border-color 150ms, box-shadow 150ms;
    }
    .custom-select-wrapper.open .custom-select-trigger,
    .custom-select-trigger:hover {
      border-color: var(--border-strong);
    }
    .custom-select-wrapper.open .custom-select-trigger {
      border-color: var(--brand-secondary);
      box-shadow: 0 0 0 3px rgba(58, 185, 176, 0.12);
    }
    .custom-select-trigger .icon {
      color: var(--text-muted);
      font-size: 20px;
      margin-right: 10px;
    }
    .custom-select-trigger .selected-text {
      flex: 1;
    }
    .custom-select-trigger .chevron {
      color: var(--text-secondary);
      transition: transform 200ms;
    }
    .custom-select-wrapper.open .chevron {
      transform: rotate(180deg);
    }
    
    .custom-options {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      z-index: 50;
      overflow: hidden;
      padding: var(--space-1) 0;
    }
    .custom-option {
      display: flex;
      align-items: center;
      padding: var(--space-2) var(--space-4);
      cursor: pointer;
      font-size: var(--text-base);
      color: var(--text-primary);
      transition: background 150ms;
    }
    .custom-option:hover {
      background: var(--brand-secondary);
      color: var(--text-inverse);
    }
    .custom-option:hover .check {
      color: var(--text-inverse);
    }
    .custom-option.selected {
      background: var(--gray-100);
      font-weight: 500;
      color: var(--brand-primary);
    }
    .custom-option .check {
      margin-left: auto;
      font-size: 18px;
      color: var(--brand-secondary);
    }
    
    /* Table Styling */
    .table-container {
      overflow-x: auto;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .table th {
      padding: var(--space-3) var(--space-4);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 2px solid var(--border);
    }
    .table td {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border);
      color: var(--text-primary);
      vertical-align: middle;
    }
    
    .user-email-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }
    
    .badge {
      background: var(--gray-100);
      color: var(--gray-700);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      background: var(--color-warning-bg, #fff3cd);
      color: var(--color-warning, #856404);
    }
    .status-badge.active {
      background: var(--color-success-bg, #d4edda);
      color: var(--color-success, #155724);
    }
    
    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }
    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 150ms;
    }
    .btn-icon:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }
    .btn-icon.danger:hover {
      background: var(--color-error-bg);
      color: var(--color-error);
    }
    .btn-icon .material-symbols-outlined {
      font-size: 20px;
    }
    
    .empty-icon {
      font-size: 48px;
      color: var(--gray-300);
      margin-bottom: 8px;
    }
    .py-8 { padding-top: var(--space-8); padding-bottom: var(--space-8); }

    .alert {
      padding: var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
    }
    .alert-success {
      background: rgba(40, 167, 69, 0.1);
      border: 1px solid rgba(40, 167, 69, 0.2);
      color: #28a745;
    }
    .alert-error {
      background: var(--color-error-bg);
      border: 1px solid var(--color-error);
      color: var(--color-error);
    }
    
    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.4);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-card {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: var(--space-6) var(--space-8);
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid var(--border);
    }
    .modal-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: var(--space-3);
      color: var(--text-primary);
    }
    .modal-body {
      color: var(--text-secondary);
      font-size: var(--text-base);
      margin-bottom: var(--space-6);
      line-height: 1.5;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
    }
    .danger-btn {
      background: var(--color-error);
      border-color: var(--color-error);
    }
    .danger-btn:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }
    
    .copy-box {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }
    .copy-box input {
      flex: 1;
      background: var(--gray-50);
      color: var(--text-secondary);
      border-color: var(--border);
    }
    .btn-copy {
      flex-shrink: 0;
      gap: 6px;
      transition: all 200ms;
    }
    .btn-copy.copied {
      background: var(--color-success);
      border-color: var(--color-success);
    }
    .btn-copy .material-symbols-outlined {
      font-size: 18px;
    }
  `]
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private elementRef = inject(ElementRef);

  users = signal<any[]>([]);
  roles = signal<any[]>([]);
  
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  math = Math;

  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.users().filter(u => u.Email.toLowerCase().includes(q) || u.RoleName.toLowerCase().includes(q));
  });

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredUsers().slice(start, end);
  });

  startRecord = computed(() => {
    if (this.filteredUsers().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endRecord = computed(() => {
    const end = this.currentPage() * this.pageSize();
    const total = this.filteredUsers().length;
    return end > total ? total : end;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.pageSize()) || 1;
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  onSearchChange(val: string) {
    this.searchQuery.set(val);
    this.currentPage.set(1);
  }

  email = '';
  roleId: number | null = null;
  loading = false;
  error = '';
  inviteUrl = '';

  dropdownOpen = false;
  
  userToDelete: any = null;
  
  userToEdit: any = null;
  editRoleId: number | null = null;
  editDropdownOpen = false;

  get selectedRoleName(): string {
    const role = this.roles().find(r => r.RoleID === this.roleId);
    return role ? role.RoleName : 'Select Role';
  }

  getEditRoleName(): string {
    const role = this.roles().find(r => r.RoleID === this.editRoleId);
    return role ? role.RoleName : 'Select Role';
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.querySelector('.custom-select-wrapper:not(.modal-select)')?.contains(event.target)) {
      this.dropdownOpen = false;
    }
    // Simple global click away for edit dropdown
    const target = event.target as HTMLElement;
    if (!target.closest('.modal-card .custom-select-wrapper')) {
      this.editDropdownOpen = false;
    }
  }

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles() {
    this.http.get<any[]>('/api/users/roles').subscribe({
      next: (roles) => {
        this.roles.set(roles);
        if (roles.length > 0) this.roleId = roles[0].RoleID;
      },
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    this.http.get<any[]>('/api/users').subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error(err)
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    this.editDropdownOpen = false;
  }

  selectRole(role: any, event: Event) {
    event.stopPropagation();
    this.roleId = role.RoleID;
    this.dropdownOpen = false;
  }
  
  toggleEditDropdown(event: Event) {
    event.stopPropagation();
    this.editDropdownOpen = !this.editDropdownOpen;
    this.dropdownOpen = false;
  }

  selectEditRole(role: any, event: Event) {
    event.stopPropagation();
    this.editRoleId = role.RoleID;
    this.editDropdownOpen = false;
  }

  invite() {
    if (!this.email || !this.roleId) return;

    this.loading = true;
    this.error = '';
    this.inviteUrl = '';

    this.http.post<any>('/api/users/invite', {
      email: this.email,
      roleId: Number(this.roleId)
    }).subscribe({
      next: (res) => {
        this.inviteUrl = res.inviteUrl;
        this.email = '';
        this.loading = false;
        this.loadUsers(); // Refresh the list
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to invite user';
        this.loading = false;
      }
    });
  }

  editUser(user: any) {
    this.userToEdit = user;
    const role = this.roles().find(r => r.RoleName === user.RoleName);
    this.editRoleId = role ? role.RoleID : this.roles()[0]?.RoleID;
  }
  
  closeEditModal() {
    this.userToEdit = null;
    this.editDropdownOpen = false;
  }

  confirmEdit() {
    if (!this.userToEdit || !this.editRoleId) return;
    this.http.put(`/api/users/${this.userToEdit.UserID}`, {
      email: this.userToEdit.Email,
      roleId: this.editRoleId
    }).subscribe({
      next: () => {
        this.loadUsers();
        this.closeEditModal();
      },
      error: (err) => alert('Failed to update user')
    });
  }

  deleteUser(user: any) {
    this.userToDelete = user;
  }

  confirmDelete() {
    if (!this.userToDelete) return;
    this.http.delete(`/api/users/${this.userToDelete.UserID}`).subscribe({
      next: () => {
        this.loadUsers();
        this.userToDelete = null;
      },
      error: (err) => alert('Failed to delete user')
    });
  }

  copied = false;

  copyLink() {
    if (!this.inviteUrl) return;
    navigator.clipboard.writeText(this.inviteUrl).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  closeInviteModal() {
    this.inviteUrl = '';
    this.copied = false;
  }
}

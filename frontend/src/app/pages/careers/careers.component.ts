import { Component, signal, computed, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';

interface Role {
  title: string;
  department: string;
  location: string;
  type: string;
  posted: string;
}

@Component({
  selector: 'careers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './careers.component.html',
  styleUrls: ['../landing/landing.scss', './careers.component.css']
})
export class CareersComponent {
  constructor(public contact: ContactService) {}
    
  searchQuery = signal('');
  filterDepartment = signal('All');
  filterLocation = signal('All');
  filterType = signal('All');

  // Custom Dropdown States
  deptOpen = signal(false);
  locOpen = signal(false);
  typeOpen = signal(false);

  roles: Role[] = [
    { title: 'Senior Full-Stack Engineer', department: 'Engineering', location: 'Remote (US)', type: 'Full-time', posted: 'Sep 2026' },
    { title: 'Data Engineer', department: 'Engineering', location: 'Remote (US)', type: 'Full-time', posted: 'Sep 2026' },
    { title: 'DevOps / Infrastructure Engineer', department: 'Engineering', location: 'Remote (US)', type: 'Full-time', posted: 'Sep 2026' },
    { title: 'Frontend Engineer', department: 'Engineering', location: 'Remote (US)', type: 'Contract', posted: 'Sep 2026' },
    { title: 'Product Designer (UI/UX)', department: 'Product & Design', location: 'Remote (US)', type: 'Full-time', posted: 'Aug 2026' },
    { title: 'Head of Product', department: 'Product & Design', location: 'Remote (US)', type: 'Full-time', posted: 'Aug 2026' },
    { title: 'Technical Writer', department: 'Product & Design', location: 'Remote (US)', type: 'Part-time', posted: 'Aug 2026' },
    { title: 'Account Executive — Enterprise', department: 'Sales', location: 'New York, NY', type: 'Full-time', posted: 'Sep 2026' },
    { title: 'Sales Development Representative', department: 'Sales', location: 'New York, NY', type: 'Full-time', posted: 'Jul 2026' },
    { title: 'Customer Success Manager', department: 'Customer Success', location: 'Remote (US)', type: 'Full-time', posted: 'Sep 2026' },
    { title: 'Supply Chain Analyst', department: 'Operations', location: 'Chicago, IL', type: 'Full-time', posted: 'Sep 2026' },
  ];

  departments = computed(() => ['All', ...new Set(this.roles.map(r => r.department))]);
  locations = computed(() => ['All', ...new Set(this.roles.map(r => r.location))]);
  types = computed(() => ['All', ...new Set(this.roles.map(r => r.type))]);

  filteredRoles = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const dept = this.filterDepartment();
    const loc = this.filterLocation();
    const type = this.filterType();

    return this.roles.filter(r => {
      if (q && !r.title.toLowerCase().includes(q) && !r.department.toLowerCase().includes(q)) return false;
      if (dept !== 'All' && r.department !== dept) return false;
      if (loc !== 'All' && r.location !== loc) return false;
      if (type !== 'All' && r.type !== type) return false;
      return true;
    });
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown-container')) {
      this.deptOpen.set(false);
      this.locOpen.set(false);
      this.typeOpen.set(false);
    }
  }

  onSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }

  toggleDept(e: Event) { e.stopPropagation(); this.deptOpen.set(!this.deptOpen()); this.locOpen.set(false); this.typeOpen.set(false); }
  toggleLoc(e: Event) { e.stopPropagation(); this.locOpen.set(!this.locOpen()); this.deptOpen.set(false); this.typeOpen.set(false); }
  toggleType(e: Event) { e.stopPropagation(); this.typeOpen.set(!this.typeOpen()); this.deptOpen.set(false); this.locOpen.set(false); }

  setDept(d: string, e: Event) { e.stopPropagation(); this.filterDepartment.set(d); this.deptOpen.set(false); }
  setLoc(l: string, e: Event) { e.stopPropagation(); this.filterLocation.set(l); this.locOpen.set(false); }
  setType(t: string, e: Event) { e.stopPropagation(); this.filterType.set(t); this.typeOpen.set(false); }

  
  
  }